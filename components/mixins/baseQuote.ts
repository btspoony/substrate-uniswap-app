import { Route } from 'vue-router'
import { Vue, Component, Watch } from 'vue-property-decorator'
import { TokenDisplay, TradePair } from '~/types'

// You can declare mixins as the same style as components.
@Component
export default class BaseQuote extends Vue {
  pathRoot: string = '/pool/create'
  pathFallbackNoExists?: string
  pathFallbackExists?: string
  base?: string
  quote?: string
  // ---- Computed --
  get availableTokens () { return this.$store.getters['tokens/normalTokens'] as TokenDisplay[] }
  get baseHash () { return this.base ? this.getTokenHash(this.base) : '' }
  set baseHash (value) {
    const symbol = this.getTokenSymbol(value)
    if (symbol && symbol !== this.base) {
      this.$router.replace(`${this.pathRoot}/${symbol}${this.quote ? '/' + this.quote : ''}`)
    }
  }
  get quoteHash () { return this.quote ? this.getTokenHash(this.quote) : '' }
  set quoteHash (value) {
    const symbol = this.getTokenSymbol(value)
    if (symbol && symbol !== this.quote) {
      this.$router.replace(`${this.pathRoot}/${this.base}/${symbol}`)
    }
  }
  // ---- Hooks --
  @Watch('$route')
  async onRouteChange (route: Route) {
    await this.updateRoute(route)
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
  async updateRoute (route: Route) {
    const base = route.params.base
    const quote = route.params.quote
    if (base !== undefined && this.base !== base) {
      const found = this.availableTokens.find(one => one.symbol.trim() === base.trim())
      if (found) {
        this.base = base.trim()
      } else if (this.pathFallbackNoExists) {
        return this.$router.replace(this.pathFallbackNoExists)
      }
    }
    if (quote !== undefined && this.quote !== quote) {
      const found = this.availableTokens.find(one => one.symbol.trim() === quote.trim())
      if (found) {
        this.quote = quote.trim()
      } else if (this.pathFallbackNoExists) {
        return this.$router.replace(this.pathFallbackNoExists)
      }
    }
    // 检测是否为已存在的 TradePair
    if (this.base && this.quote && this.pathFallbackExists) {
      const tradePair = (await this.$store.dispatch('pool/fetchTradePairByBaseQuote', {
        base: this.baseHash,
        quote: this.quoteHash
      })) as TradePair | undefined
      if (tradePair) {
        const targetBaseSymbol = this.getTokenSymbol(tradePair.base.toHex())
        const targetQuoteSymbol = this.getTokenSymbol(tradePair.quote.toHex())
        // 下一Tick 转路由
        Vue.nextTick(() => {
          this.$router.replace(`${this.pathFallbackExists}/${targetBaseSymbol}/${targetQuoteSymbol}`)
        })
      }
    }
  }
}
