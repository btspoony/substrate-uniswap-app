import { Vue, Component, Watch } from 'vue-property-decorator'
import { User, TokenDisplay, TradePair, TokenBalances } from '~/types'

let singletonPromise: Promise<any> | undefined
const currentTradeState: {
  lt?: TokenBalances,
  base?: TokenBalances,
  quote?: TokenBalances,
  poolBase?: TokenBalances,
  poolQuote?: TokenBalances
} = Vue.observable({
  base: undefined,
  quote: undefined,
  lt: undefined,
  poolBase: undefined,
  poolQuote: undefined
})

// You can declare mixins as the same style as components.
@Component
export default class TradePairInfo extends Vue {
  // ---- Computed --
  get availableTokens () { return this.$store.getters['tokens/normalTokens'] as TokenDisplay[] }
  get currentUser () { return this.$store.getters['currentUser'] as User }
  get isBalanceDirty () { return this.$store.getters['tokens/isBalanceDirty'] as boolean }
  get currentTradePair () { return this.$store.getters['pool/currentTradePair'] as TradePair }
  get currentTradePairSymbol () {
    return this.currentTradePair ? this.getTokenSymbol(this.currentTradePair.liquidity_token_hash.toHex()) : 'None'
  }
  get currentTradePairBaseSymbol () {
    return this.currentTradePair ? this.getTokenSymbol(this.currentTradePair.base.toHex()) : 'NoBase'
  }
  get currentTradePairQuoteSymbol () {
    return this.currentTradePair ? this.getTokenSymbol(this.currentTradePair.quote.toHex()) : 'NoQuote'
  }
  get currentTradePairBalances () { return currentTradeState.lt }
  get ownedLTBalance () { return this.toBalance(currentTradeState.lt) }
  get ownedBaseBalance () { return this.toBalance(currentTradeState.base) }
  get ownedQuoteBalance () { return this.toBalance(currentTradeState.quote) }
  get poolBaseBalance () { return this.toBalance(currentTradeState.poolBase) }
  get poolQuoteBalance () { return this.toBalance(currentTradeState.poolQuote) }
  get poolPrice () {
    const quoteValue = this.poolQuoteBalance
    const baseValue = this.poolBaseBalance
    if (baseValue === 0 || quoteValue === 0) return 0
    return this.formatDecimal(quoteValue / baseValue)
  }
  // ---- Hooks --
  @Watch('currentUser')
  async onCurrentUserChange() {
    await this.refreshTradePairBalances()
  }
  @Watch('currentTradePair')
  async onCurrentTradePairChange() {
    await this.refreshTradePairBalances()
  }
  @Watch('isBalanceDirty')
  async onBalanceDirty(newVal: boolean) {
    if (newVal) {
      await this.refreshTradePairBalances()
      this.$store.commit('tokens/SET_BALANCE_DIRTY', false)
    }
  }
  // ------ Methods ---
  isNumber (value?: string) {
    const parsed = parseFloat(value || '')
    return !isNaN(parsed) && `${parsed}` === value
  }
  toNoDecimalNumber (value: string | number | undefined) {
    if (typeof value === 'number') return value * 1e8
    const parsed = parseFloat(value || '')
    if (!isNaN(parsed)) {
      return Math.floor(parsed * 1e8)
    } else {
      return -1
    }
  }
  toBalance (value?: TokenBalances) {
    return value ? value.free.toNumber() / 1e8 : 0
  }
  formatDecimal (value: number | string | undefined) {
    return Math.floor(this.toNoDecimalNumber(value)) / 1e8
  }
  getTokenSymbol (hash: string) {
    const found = this.availableTokens.find(one => one.hash === hash)
    return found ? found.symbol.trim() : ''
  }
  getTokenHash (symbol: string) {
    const found = this.availableTokens.find(one => one.symbol.trim() === symbol)
    return found ? found.hash : ''
  }
  /**
   * 通过 base 计算 swap quote
   */
  calculateCurrentSwapBuyQuote (baseAmount: number) {
    // Substrate源码
    // let quote_amount = (pool_quote_amount * (pool_base_amount + base_amount)
    // - pool_quote_amount * pool_base_amount)
    // / (pool_base_amount + base_amount);
    const poolQuoteAmount = this.poolQuoteBalance
    const poolBaseAmount = this.poolBaseBalance
    if (poolBaseAmount <= 0 || poolQuoteAmount <= 0) return 0
    // 计算并返回
    return (poolQuoteAmount * (poolBaseAmount + baseAmount)
      - poolQuoteAmount * poolBaseAmount)
      / (poolBaseAmount + baseAmount)
  }
  /**
   * 通过 quote 计算 swap base
   */
  calculateCurrentSwapSellQuote (quoteAmount: number) {
    // Substrate源码
    // let base_amount = (pool_base_amount * (pool_quote_amount + quote_amount)
    // - pool_quote_amount * pool_base_amount)
    // / (pool_quote_amount + quote_amount);
    const poolQuoteAmount = this.poolQuoteBalance
    const poolBaseAmount = this.poolBaseBalance
    if (poolBaseAmount <= 0 || poolQuoteAmount <= 0) return 0
    // 计算并返回
    return (poolQuoteAmount * (poolQuoteAmount + quoteAmount)
      - poolQuoteAmount * poolBaseAmount)
      / (poolQuoteAmount + quoteAmount)
  }
  /**
   * 通过 base 计算 add liguidity 时需要加的 quote
   */
  calculateAddLiquidityQuote (baseAmount: number) {
    const price = this.poolPrice
    if (price === 0) return 0
    return this.formatDecimal(price * baseAmount)
  }
  /**
   *
   * 通过 quote 计算 add liguidity 时需要加的 base
   */
  calculateAddLiquidityBase (quoteAmount: number) {
    const price = this.poolPrice
    if (price === 0) return 0
    return this.formatDecimal(quoteAmount / price)
  }
  /**
   * 获取并设置当前 TradePair
   */
  async fetchCurrentTradePair (base?: string, quote?: string) {
    await this.fetchCurrentTradePairByHash(
      base ? this.getTokenHash(base): undefined,
      quote ? this.getTokenHash(quote) :undefined
    )
  }
  /**
   * 获取并设置当前 TradePair
   */
  async fetchCurrentTradePairByHash (baseHash?: string, quoteHash?: string) {
    this.clearCurrentTradePair()
    // 检测是否为已存在的 TradePair
    if (baseHash && quoteHash) {
      await this.$store.dispatch('pool/fetchTradePairByBaseQuote', {
        base: baseHash,
        quote: quoteHash,
        isSetCurrent: true
      })
    }
  }
  /**
   * 移除当前 TradePair
   */
  clearCurrentTradePair () {
    this.$store.commit('pool/SET_CURRENT_TRADE_PAIR', -1)
  }
  async refreshTradePairBalances () {
    if (!this.currentUser) return
    if (!this.currentTradePair) {
      currentTradeState.lt = undefined
      currentTradeState.base = undefined
      currentTradeState.quote = undefined
      return
    }
    if (singletonPromise) return singletonPromise
    // 确保同时只有一个 Promise
    singletonPromise = Promise.all([
      this.$store.dispatch('tokens/queryTokenBalance', {
        tokenHash: this.currentTradePair.liquidity_token_hash.toHex(),
        address: this.currentUser.address
      }),
      this.$store.dispatch('tokens/queryTokenBalance', {
        tokenHash: this.currentTradePair.base.toHex(),
        address: this.currentUser.address
      }),
      this.$store.dispatch('tokens/queryTokenBalance', {
        tokenHash: this.currentTradePair.quote.toHex(),
        address: this.currentUser.address
      }),
      this.$store.dispatch('tokens/queryTokenBalance', {
        tokenHash: this.currentTradePair.base.toHex(),
        address: this.currentTradePair.account.toString()
      }),
      this.$store.dispatch('tokens/queryTokenBalance', {
        tokenHash: this.currentTradePair.quote.toHex(),
        address: this.currentTradePair.account.toString()
      })
    ])
    .then((all: TokenBalances[]) => {
      currentTradeState.lt = all[0]
      currentTradeState.base = all[1]
      currentTradeState.quote = all[2]
      currentTradeState.poolBase = all[3]
      currentTradeState.poolQuote = all[4]
      singletonPromise = undefined
    }).catch(err => (console.error(err)))
  }
}
