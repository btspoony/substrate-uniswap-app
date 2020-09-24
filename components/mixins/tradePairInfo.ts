import { Vue, Component, Watch } from 'vue-property-decorator'
import { User, TokenDisplay, TradePair, TokenBalances } from '~/types'

let singletonPromise: Promise<any> | undefined
const currentTradeState: { balances?: TokenBalances } = Vue.observable({ balances: undefined })

// You can declare mixins as the same style as components.
@Component
export default class TradePairInfo extends Vue {
  // ---- Computed --
  get availableTokens () { return this.$store.getters['tokens/normalTokens'] as TokenDisplay[] }
  get currentUser () { return this.$store.getters['currentUser'] as User }
  get currentTradePair () { return this.$store.getters['pool/currentTradePair'] as TradePair }
  get currentTradePairBalances () { return currentTradeState.balances }
  get isBalanceDirty () { return this.$store.getters['tokens/isBalanceDirty'] as boolean }
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
  async onBalanceDirty() {
    await this.refreshTradePairBalances()
  }
  // ------ Methods ---
  getTokenSymbol (hash: string) {
    const found = this.availableTokens.find(one => one.hash === hash)
    return found ? found.symbol.trim() : ''
  }
  getTokenHash (symbol: string) {
    const found = this.availableTokens.find(one => one.symbol.trim() === symbol)
    return found ? found.hash : ''
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
      currentTradeState.balances = undefined
      return
    }
    if (singletonPromise) return singletonPromise
    // 确保同时只有一个 Promise
    singletonPromise = this.$store.dispatch('tokens/queryTokenBalance', {
      tokenHash: this.currentTradePair.liquidity_token_hash.toHex(),
      address: this.currentUser.address
    }).then((balances: TokenBalances) => {
      currentTradeState.balances = balances
      singletonPromise = undefined
    }).catch(err => (console.error(err)))
  }
}
