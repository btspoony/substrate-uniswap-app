<template>
  <el-form
    ref="form"
    :model="formData"
    label-position="top"
    label-width="80px"
  >
    <el-form-item
      v-if="currentTradePairBalances"
      label="Information"
    >
      <span><strong>Owned: </strong>{{ currentTradePairBalances.free.toNumber() / 1e8 }}</span>
    </el-form-item>
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
      pathRoot: '/pool/add',
      pathFallbackNoExists: '/pool'
    }
  }
})
export default class AddBaseQuoteComponent extends mixins(BaseQuote) {
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
  get isButtonEnabled () {
    return !!this.formData.baseTokenHash &&
      !!this.formData.quoteTokenHash &&
      this.isNumber(this.formData.baseAmount) &&
      this.isNumber(this.formData.quoteAmount)
  }
  get buttonText () {
    return !this.base ? 'Select a token(Base)' :
      (!this.quote ? 'Select a token(Quote)' :
      (!this.isButtonEnabled ? 'Input an amount' : 'Add Liquidity'))
  }
  // ---- Hooks --
  @Watch('baseHash')
  onBaseHashChange (val: string) {
    this.formData.baseTokenHash = val
  }
  @Watch('quoteHash')
  onQuoteHashChange (val: string) {
    this.formData.quoteTokenHash = val
  }
  @Watch('base')
  onBaseChange() {
    this.ensureExists()
  }
  @Watch('quote')
  onQuoteChange() {
    this.ensureExists()
  }
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
