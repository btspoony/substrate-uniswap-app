<template>
  <el-row>
    <el-col
      :sm="{ span: 18, offset: 3 }"
      :xs="{ span: 20, offset: 2 }"
    >
      <el-card class="width-100-percent">
        <div slot="header" class="clearfix">
          <h2>{{ isBuy ? 'Buy' : 'Sell' }}</h2>
        </div>
        <el-form
          ref="form"
          :model="formData"
          label-position="top"
        >
          <ItemCurrentTradePairInfo />
          <ItemTokenInput
            icon="el-icon-sold-out"
            :item-label="isBuy ? `From` : `To`"
            item-prop="baseAmount"
            :amount.sync="formData.baseAmount"
            :hash.sync="formData.baseTokenHash"
            :tokens="availableFromTokens"
            :amountMax="isBuy ? ownedBaseBalance : Number.MAX_SAFE_INTEGER"
          />
          <el-row>
            <el-col class="align-center" :span="8" :offset="8">
              <el-button
                circle
                icon="el-icon-refresh"
                @click="onChangeFromTo"
              ></el-button>
            </el-col>
          </el-row>
          <ItemTokenInput
            icon="el-icon-sell"
            :item-label="!isBuy ? 'From' : 'To'"
            item-prop="quoteAmount"
            :amount.sync="formData.quoteAmount"
            :hash.sync="formData.quoteTokenHash"
            :tokens="availableToTokens"
            :amountMax="!isBuy ? ownedQuoteBalance : Number.MAX_SAFE_INTEGER"
          />
          <el-form-item>
            <el-button
              class="width-100-percent"
              type="primary"
              :disabled="!isSwapButtonEnabled"
              @click="onTrySwap"
            >{{ swapButtonText }}</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { mixins } from 'vue-class-component'
import { Vue, Component, Watch } from 'vue-property-decorator'
import TradePairInfo from '~/components/mixins/tradePairInfo'
import { TokenDisplay, TradePair } from '~/types'
import * as pool from '~/store/pool'

type FormData = {
  baseTokenHash?: string,
  baseAmount?: string,
  quoteTokenHash?: string,
  quoteAmount?: string
}

@Component({
  async fetch (ctx) {
    await ctx.store.dispatch('tokens/queryAllTokens')
    await ctx.store.dispatch('pool/queryTradePairs')
  }
})
export default class SwapPageComponent extends mixins(TradePairInfo) {
  internalChanging = false
  formData: FormData = {
    baseTokenHash: '',
    baseAmount: '',
    quoteTokenHash: '',
    quoteAmount: ''
  }
  isBuy: boolean = true
  // ---- Computed --
  get allTradePairs () { return (this.$store.state.pool as pool.ModuleState).tradePairs }
  get availableFromTokens () {
    if (!this.formData.quoteTokenHash) return this.availableTokens
    const toHash = this.formData.quoteTokenHash
    return this.availableTokens.filter(one => one.hash !== toHash)
  }
  get availableToTokens () {
    const availableHashs = this.allTradePairs.reduce((result, curr) => {
      const quoteHash = curr.quote.toHex()
      if (result.includes(quoteHash)) return result
      if (!this.formData.baseTokenHash) {
        result.push(quoteHash)
      } else {
        const baseHash = curr.base.toHex()
        if (this.formData.baseTokenHash === baseHash) {
          result.push(quoteHash)
        }
      }
      return result
    }, [] as string[])
    const allValues = this.availableTokens.filter(one => availableHashs.includes(one.hash))
    if (allValues.length === 0) {
      this.formData.quoteTokenHash = ''
    }
    return allValues
  }
  get isPoolEnough () {
    return this.currentTradePair &&
      this.poolQuoteBalance > 0 &&
      this.poolBaseBalance > 0
  }
  get isBaseEnough () {
    const value = this.formatDecimal(this.formData.baseAmount)
    return value > 0 && value <= this.ownedBaseBalance
  }
  get isQuoteEnough () {
    const value = this.formatDecimal(this.formData.quoteAmount)
    return value > 0 && value <= this.ownedQuoteBalance
  }
  get isSwapButtonEnabled () {
    return !this.internalChanging &&
      this.currentTradePair &&
      this.formData.baseTokenHash !== '' &&
      this.formData.quoteTokenHash !== '' &&
      this.isPoolEnough &&
      this.isBaseEnough && this.isQuoteEnough
  }
  get swapButtonText () {
    return this.formData.baseTokenHash === '' ? 'Select a token(Base)' :
      (this.formData.quoteTokenHash === '' || !this.currentTradePair ? 'Select a token(Quote)' :
      (!this.isPoolEnough ? 'No Liquidity for the pair' :
      (!this.isSwapButtonEnabled ? 'Input valid amount' : 'Swap')))
  }
  // ---- Watch --
  @Watch('formData.baseTokenHash')
  async onFormDataBaseChange (newVal: string) {
    await this.tryUpdateCurrentTradePair(newVal, this.formData.quoteTokenHash)
  }
  @Watch('formData.quoteTokenHash')
  async onFormDataQuoteChange (newVal: string) {
    await this.tryUpdateCurrentTradePair(this.formData.baseTokenHash, newVal)
  }
  @Watch('formData.baseAmount')
  onBaseAmountChagne(newVal: string) {
    if (this.internalChanging) return
    if (!this.isNumber(newVal)) return
    const value = this.formatDecimal(newVal)
    const quoteAmount = this.calculateCurrentSwapBuyQuote(value)
    this.internalChanging = true
    this.formData.quoteAmount = `${quoteAmount}`
    Vue.nextTick(() => this.internalChanging = false)
  }
  @Watch('formData.quoteAmount')
  onQuoteAmountChagne(newVal: string) {
    if (this.internalChanging) return
    if (!this.isNumber(newVal)) return
    const value = this.formatDecimal(newVal)
    const baseAmount = this.calculateCurrentSwapSellQuote(value)
    this.internalChanging = true
    this.formData.baseAmount = `${baseAmount}`
    Vue.nextTick(() => this.internalChanging = false)
  }
  // ---- Hooks --
  async mounted () {
    if (this.availableTokens.length > 0) {
      const firstToken = this.availableTokens[0]
      this.formData.baseTokenHash = firstToken.hash
    }
  }
  // ------ Methods ---
  async tryUpdateCurrentTradePair (baseHash?: string, quoteHash?: string) {
    if (baseHash && quoteHash) {
      await this.fetchCurrentTradePairByHash(baseHash, quoteHash)
    } else {
      this.clearCurrentTradePair()
    }
    Vue.nextTick(() => {
      (this.$refs['form'] as any).clearValidate()
    })
  }
  // ------ UI Handler ---
  onChangeFromTo () {
    this.isBuy = !this.isBuy
  }
  async onTrySwap () {
    const form = this.$refs['form'] as any
    const isOk = await form.validate()
    if (!isOk) return
    // 验证通过，调用请求
    try {
      if (this.isBuy) {
        const requestBody: pool.PayloadBuy = {
          hash: this.currentTradePair.tp_hash.toHex(),
          baseAmount: this.toNoDecimalNumber(this.formData.baseAmount)
        }
        await this.$store.dispatch('pool/buyTokenInTradePair', requestBody)
      } else {
        const requestBody: pool.PayloadSell = {
          hash: this.currentTradePair.tp_hash.toHex(),
          quoteAmount: this.toNoDecimalNumber(this.formData.quoteAmount)
        }
        await this.$store.dispatch('pool/sellTokenInTradePair', requestBody)
      }
    } catch (err) { console.error(err) }
  }
}
</script>
