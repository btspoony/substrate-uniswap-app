<template>
  <el-form
    ref="form"
    :model="formData"
    label-position="top"
    label-width="80px"
  >
    <ItemTokenInput
      icon="el-icon-sold-out"
      item-label="Base"
      item-prop="baseAmount"
      :amount.sync="formData.baseAmount"
      :hash.sync="baseHash"
      :tokens="availableBaseTokens"
    />
    <el-row>
      <el-col class="align-center" :span="8" :offset="8">
        <i class="el-icon-plus" />
      </el-col>
    </el-row>
    <ItemTokenInput
      icon="el-icon-sell"
      item-label="Quote"
      item-prop="quoteAmount"
      :amount.sync="formData.quoteAmount"
      :hash.sync="quoteHash"
      :tokens="availableQuoteTokens"
    />
    <el-form-item>
      <el-button
        class="width-100-percent"
        type="primary"
        :disabled="!isButtonEnabled"
        @click="onTryExecute"
      >{{ buttonText }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
import { Route } from 'vue-router'
import { Vue, Component, Watch } from 'vue-property-decorator'
import { TokenDisplay, TradePair } from '~/types'
import * as pool from '~/store/pool'

type FormData = {
  baseTokenHash?: string,
  baseAmount?: string,
  quoteTokenHash?: string,
  quoteAmount?: string
}

@Component({
  asyncData ({ params }) {
    return { base: params.base, quote: params.quote }
  }
})
export default class BaseQuoteComponent extends Vue {
  base?: string
  quote?: string
  formData: FormData = {}
  // ---- Computed --
  get allTradePairs () { return (this.$store.state.pool as pool.ModuleState).tradePairs }
  get availableTokens () { return this.$store.getters['tokens/normalTokens'] as TokenDisplay[] }
  get availableBaseTokens () {
    if (!this.formData.quoteTokenHash) return this.availableTokens
    const hash = this.formData.quoteTokenHash
    return this.availableTokens.filter(one => one.hash !== hash)
  }
  get availableQuoteTokens () {
    if (!this.formData.baseTokenHash) return this.availableTokens
    const hash = this.formData.baseTokenHash
    return this.availableTokens.filter(one => one.hash !== hash)
  }
  get baseHash () { return this.base ? this.getTokenHash(this.base) : '' }
  set baseHash (value) {
    const symbol = this.getTokenSymbol(value)
    if (symbol) {
      this.$router.replace(`/pool/create/${symbol}${this.quote ? '/' + this.quote : ''}`)
    }
  }
  get quoteHash () { return this.quote ? this.getTokenHash(this.quote) : '' }
  set quoteHash (value) {
    const symbol = this.getTokenSymbol(value)
    if (symbol) {
      this.$router.replace(`/pool/create/${this.base}/${symbol}`)
    }
  }
  get isButtonEnabled () {
    return this.formData.baseTokenHash !== '' &&
      this.formData.quoteTokenHash !== '' &&
      this.isNumber(this.formData.baseAmount) &&
      this.isNumber(this.formData.quoteAmount)
  }
  get buttonText () { return 'Create TradePair' }
  // ---- Hooks --
  @Watch('$route')
  async onRouteChange (route: Route) {
    await this.updateRoute(route)
  }
  async mounted () {
    await this.updateRoute(this.$route)
  }
  // ------ Methods ---
  isNumber (value?: string) {
    const parsed = parseFloat(value || '')
    return !isNaN(parsed) && `${parsed}` === value
  }
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
    const formDataUpdate = this.formData
    if (base !== undefined) {
      this.base = base.trim()
      const found = this.availableTokens.find(one => one.symbol.trim() === this.base)
      if (found) {
        formDataUpdate.baseTokenHash = found.hash
      } else {
        return this.$router.replace('/pool')
      }
    }
    if (quote !== undefined) {
      this.quote = quote.trim()
      const found = this.availableQuoteTokens.find(one => one.symbol.trim() === this.quote)
      if (found) {
        formDataUpdate.quoteTokenHash = found.hash
      } else {
        return this.$router.replace('/pool')
      }
    }
    // 检测是否为已存在的 TradePair
    if (this.base && this.quote) {
      const tradePair = (await this.$store.dispatch('pool/fetchTradePairByBaseQuote', { base: this.base, quote: this.quote })) as TradePair | undefined
      if (tradePair) {
        const targetBaseSymbol = this.getTokenSymbol(tradePair.base.toHex())
        const targetQuoteSymbol = this.getTokenSymbol(tradePair.quote.toHex())
        return this.$router.replace(`/pool/add/${targetBaseSymbol}/${targetQuoteSymbol}`)
      }
    }
    // 更新 formData
    this.formData = formDataUpdate
  }
  // ------ UI Handler ---
  onTryExecute () {
    // TODO
  }
}
</script>
