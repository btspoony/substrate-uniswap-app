import { Vue, Component } from 'vue-property-decorator'
import { TokenDisplay, TradePair } from '~/types'

// You can declare mixins as the same style as components.
@Component
export default class TradePairInfo extends Vue {
  // ---- Computed --
  get availableTokens () { return this.$store.getters['tokens/normalTokens'] as TokenDisplay[] }
  get currentTradePair () { return this.$store.getters['pool/currentTradePair'] as TradePair }
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
}
