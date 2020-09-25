import { Route } from 'vue-router'
import { mixins } from 'vue-class-component'
import { Vue, Component, Watch } from 'vue-property-decorator'
import TradePairInfo from './tradePairInfo'

// You can declare mixins as the same style as components.
@Component
export default class BaseQuote extends mixins(TradePairInfo) {
  pathRoot: string = '/pool/create'
  pathFallbackNoExists?: string
  base?: string
  quote?: string
  fetchingPromise?: Promise<any>
  // ---- Computed --
  get baseHash () { return this.base ? this.getTokenHash(this.base) : '' }
  set baseHash (value: string) {
    const symbol = this.getTokenSymbol(value)
    if (symbol && symbol !== this.base) {
      this.$router.replace(`${this.pathRoot}/${symbol}${this.quote ? '/' + this.quote : ''}`)
    }
  }
  get quoteHash () { return this.quote ? this.getTokenHash(this.quote) : '' }
  set quoteHash (value: string) {
    const symbol = this.getTokenSymbol(value)
    if (symbol && symbol !== this.quote) {
      this.$router.replace(`${this.pathRoot}/${this.base}/${symbol}`)
    }
  }
  // ---- Hooks --
  @Watch('$route')
  onRouteChange (route: Route) {
    this.updateRoute(route)
  }
  mounted () {
    this.updateRoute(this.$route)
  }
  // ------ Methods ---
  updateRoute (route: Route) {
    const base = route.params.base
    const quote = route.params.quote
    let baseToUpdate = this.base
    let quoteToUpdate = this.quote
    if (base !== undefined && this.base !== base) {
      const found = this.availableTokens.find(one => one.symbol.trim() === base.trim())
      if (found) {
        baseToUpdate = base.trim()
      } else if (this.pathFallbackNoExists) {
        return this.$router.replace(this.pathFallbackNoExists)
      }
    }
    if (quote !== undefined && this.quote !== quote) {
      const found = this.availableTokens.find(one => one.symbol.trim() === quote.trim())
      if (found) {
        quoteToUpdate = quote.trim()
      } else if (this.pathFallbackNoExists) {
        return this.$router.replace(this.pathFallbackNoExists)
      }
    }
    // 获取信息
    this.fetchingPromise = this.fetchCurrentTradePair(baseToUpdate, quoteToUpdate)
      .then(resolve => { this.fetchingPromise = undefined })
  }
}
