<template>
  <el-form
    ref="form"
    :model="formData"
    label-position="top"
  >
    <ItemCurrentTradePairInfo />
    <ItemTokenInput
      icon="el-icon-sold-out"
      item-label="Base"
      item-prop="baseAmount"
      :tokens="availableBaseTokens"
      :amount.sync="formData.baseAmount"
      :hash.sync="baseHash"
      :amountMax="ownedBaseBalance"
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
      :tokens="availableQuoteTokens"
      :amount.sync="formData.quoteAmount"
      :hash.sync="quoteHash"
      :amountMax="ownedQuoteBalance"
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
import { mixins } from 'vue-class-component'
import { Vue, Component, Watch } from 'vue-property-decorator'
import BaseQuote from '~/components/mixins/baseQuote'
import { TokenDisplay, TradePair } from '~/types'
import * as pool from '~/store/pool'

@Component({
  asyncData ({ params }) {
    return {
      base: params.base,
      quote: params.quote,
      pathRoot: '/pool/add',
      pathFallbackNoExists: '/pool'
    }
  }
})
export default class AddBaseQuoteComponent extends mixins(BaseQuote) {
  internalChanging = false
  formData = {
    baseTokenHash: '',
    baseAmount: '',
    quoteTokenHash: '',
    quoteAmount: ''
  }
  // ---- Computed --
  get allTradePairs () { return (this.$store.state.pool as pool.ModuleState).tradePairs }
  get availableBaseTokens () {
    const availableHashs = this.allTradePairs.reduce((result, curr) => {
      const baseHash = curr.base.toHex()
      if (result.includes(baseHash)) return result
      if (!this.quote) {
        result.push(baseHash)
      } else {
        const quoteHash = curr.quote.toHex()
        if (this.quote === this.getTokenSymbol(quoteHash)) {
          result.push(baseHash)
        }
      }
      return result
    }, [] as string[])
    return this.availableTokens.filter(one => availableHashs.includes(one.hash))
  }
  get availableQuoteTokens () {
    const availableHashs = this.allTradePairs.reduce((result, curr) => {
      const quoteHash = curr.quote.toHex()
      if (result.includes(quoteHash)) return result
      if (!this.base) {
        result.push(quoteHash)
      } else {
        const baseHash = curr.base.toHex()
        if (this.base === this.getTokenSymbol(baseHash)) {
          result.push(quoteHash)
        }
      }
      return result
    }, [] as string[])
    return this.availableTokens.filter(one => availableHashs.includes(one.hash))
  }
  get isBaseEnough () {
    const value = this.formatDecimal(this.formData.baseAmount)
    return value > 0 && value <= this.ownedBaseBalance
  }
  get isQuoteEnough () {
    const value = this.formatDecimal(this.formData.quoteAmount)
    return value > 0 && value <= this.ownedQuoteBalance
  }
  get isButtonEnabled () {
    return !!this.formData.baseTokenHash &&
      !!this.formData.quoteTokenHash &&
      this.isBaseEnough && this.isQuoteEnough
  }
  get buttonText () {
    return !this.base ? 'Select a token(Base)' :
      (!this.quote ? 'Select a token(Quote)' :
      (!this.isButtonEnabled ? 'Input valid amount' : 'Add Liquidity'))
  }
  // ---- Watch --
  @Watch('base')
  onBaseChange() {
    this.formData.baseTokenHash = this.baseHash
    this.ensureExists()
  }
  @Watch('quote')
  onQuoteChange() {
    this.formData.quoteTokenHash = this.quoteHash
    this.ensureExists()
  }
  @Watch('formData.baseAmount')
  onBaseAmountChagne(newVal: string) {
    if (this.internalChanging) return
    if (!this.isNumber(newVal)) return
    const value = this.formatDecimal(newVal)
    const quoteAmount = this.calculateAddLiquidityQuote(value)
    this.internalChanging = true
    this.formData.quoteAmount = `${quoteAmount}`
    Vue.nextTick(() => this.internalChanging = false)
  }
  @Watch('formData.quoteAmount')
  onQuoteAmountChagne(newVal: string) {
    if (this.internalChanging) return
    if (!this.isNumber(newVal)) return
    const value = this.formatDecimal(newVal)
    const baseAmount = this.calculateAddLiquidityBase(value)
    this.internalChanging = true
    this.formData.baseAmount = `${baseAmount}`
    Vue.nextTick(() => this.internalChanging = false)
  }
  // ---- Hooks --
  async mounted () {
    this.formData.baseTokenHash = this.baseHash
    this.formData.quoteTokenHash = this.quoteHash
  }
  // ------ Methods --
  ensureExists () {
    if (!this.currentTradePair && this.base && this.quote) {
      // 下一Tick 转路由
      Vue.nextTick(() => {
        this.$router.replace(`/pool/create/${this.base}/${this.quote}`)
      })
    }
  }
  async onTryExecute () {
    const form = this.$refs['form'] as any
    const isOk = await form.validate()
    if (!isOk) return
    try {
      const requestBody: pool.PayloadAddLiquidity = {
        hash: this.currentTradePair.tp_hash.toHex(),
        baseAmount: Math.floor(parseFloat(this.formData.baseAmount || '0') * 1e8)
      }
      if (this.currentTradePair.liquidity_token_issued_amount.toNumber() === 0) {
        requestBody.quoteAmount = Math.floor(parseFloat(this.formData.quoteAmount || '0') * 1e8)
      }
      await this.$store.dispatch('pool/addLiquidityToTradePair', requestBody)
    } catch (err) { console.error(err) }
    form.clearValidate()
    this.$router.replace('/pool')
  }
}
</script>
