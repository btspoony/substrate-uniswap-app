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
      pathRoot: '/pool/create',
      pathFallbackNoExists: '/pool'
    }
  }
})
export default class CreateBaseQuoteComponent extends mixins(BaseQuote) {
  formData = {
    baseTokenHash: '',
    baseAmount: '',
    quoteTokenHash: '',
    quoteAmount: ''
  }
  // ---- Computed --
  get availableBaseTokens () {
    if (!this.quote) return this.availableTokens
    return this.availableTokens.filter(one => one.symbol.trim() !== this.quote)
  }
  get availableQuoteTokens () {
    if (!this.base) return this.availableTokens
    return this.availableTokens.filter(one => one.symbol.trim() !== this.base)
  }
  get isButtonEnabled () {
    return !!this.formData.baseTokenHash &&
      !!this.formData.quoteTokenHash &&
      this.isNumber(this.formData.baseAmount) &&
      this.isNumber(this.formData.quoteAmount)
  }
  get buttonText () {
    return !this.base ? 'Select a token(Base)' :
      (!this.quote ? 'Select a token(Quote)' :
      (!this.isButtonEnabled ? 'Input an amount' : 'Create TradePair'))
  }
  // ---- Hooks --
  @Watch('currentTradePair')
  onTradePairChange (val?: TradePair) {
    if (val) {
      const targetBaseSymbol = this.getTokenSymbol(val.base.toHex())
      const targetQuoteSymbol = this.getTokenSymbol(val.quote.toHex())
      // 下一Tick 转路由
      Vue.nextTick(() => {
        this.$router.replace(`/pool/add/${targetBaseSymbol}/${targetQuoteSymbol}`)
      })
    }
  }
  @Watch('base')
  onBaseChange() {
    this.formData.baseTokenHash = this.baseHash
  }
  @Watch('quote')
  onQuoteChange() {
    this.formData.quoteTokenHash = this.quoteHash
  }
  async mounted () {
    this.formData.baseTokenHash = this.baseHash
    this.formData.quoteTokenHash = this.quoteHash
  }
  // ------ UI Handler ---
  async onTryExecute () {
    const form = this.$refs['form'] as any
    const isOk = await form.validate()
    if (!isOk) return
    try {
      await this.$store.dispatch('pool/createNewTradePair', {
        base: this.formData.baseTokenHash,
        quote: this.formData.quoteTokenHash,
        baseAmount: Math.floor(parseFloat(this.formData.baseAmount || '0') * 1e8),
        quoteAmount: Math.floor(parseFloat(this.formData.quoteAmount || '0') * 1e8)
      })
    } catch (err) { console.error(err) }
    form.clearValidate()
    this.$router.replace('/pool')
  }
}
</script>
