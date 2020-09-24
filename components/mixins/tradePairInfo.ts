import { Vue, Component, Watch } from 'vue-property-decorator'
import { User, TokenDisplay, TradePair, TokenBalances } from '~/types'

let singletonPromise: Promise<any> | undefined
const currentTradeState: { balances?: TokenBalances } = Vue.observable({ balances: undefined })

// You can declare mixins as the same style as components.
@Component
export default class TradePairInfo extends Vue {
  // ---- Computed --
  get availableTokens () { return this.$store.getters['tokens/normalTokens'] as TokenDisplay[] }
  get currentTradePair () { return this.$store.getters['pool/currentTradePair'] as TradePair }
  get currentTradePairBalances () { return currentTradeState.balances }
  get currentUser () { return this.$store.getters['currentUser'] as User }
  // ---- Hooks --
  @Watch('currentUser')
  async onCurrentUserChange() {
    await this.refreshTradePairBalances()
  }
  @Watch('currentTradePair')
  async onCurrentTradePairChange() {
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
  async fetchCurrentTradePair (base?: string, quote?: string) {
    this.$store.commit('pool/SET_CURRENT_TRADE_PAIR', -1)
    // 检测是否为已存在的 TradePair
    if (base && quote) {
      await this.$store.dispatch('pool/fetchTradePairByBaseQuote', {
        base: this.getTokenHash(base),
        quote: this.getTokenHash(quote),
        isSetCurrent: true
      })
    }
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
