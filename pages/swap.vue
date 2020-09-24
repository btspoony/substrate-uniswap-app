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
          label-width="80px"
        >
          <ItemCurrentTradePairInfo />
          <ItemTokenInput
            icon="el-icon-sold-out"
            :item-label="isBuy ? 'From' : 'To'"
            item-prop="baseAmount"
            :amount.sync="formData.baseAmount"
            :hash.sync="formData.baseTokenHash"
            :tokens="availableFromTokens"
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
import { Component, Watch } from 'vue-property-decorator'
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
  formData: FormData = {}
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
  get isSwapButtonEnabled () {
    return this.currentTradePair &&
      this.formData.baseTokenHash !== '' &&
      this.formData.quoteTokenHash !== '' &&
      this.isNumber(this.formData.baseAmount) &&
      this.isNumber(this.formData.quoteAmount)
  }
  get swapButtonText () {
    const noFromToken = this.formData.baseTokenHash === ''
    const noToToken = this.formData.quoteTokenHash === ''
    return noFromToken ? 'Select a token(Base)' :
      (noToToken || !this.currentTradePair ? 'Select a token(Quote)' :
      (!this.isNumber(this.formData.baseAmount) || !this.isNumber(this.formData.quoteAmount) ? 'Input an amount' : 'Swap'))
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
  // ---- Hooks --
  async mounted () {
    this.resetData()
    if (this.availableTokens.length > 0) {
      const firstToken = this.availableTokens[0]
      this.formData.baseTokenHash = firstToken.hash
    }
  }
  // ------ Methods ---
  resetData () {
    this.clearCurrentTradePair()
    this.formData = {
      baseTokenHash: '',
      baseAmount: '',
      quoteTokenHash: '',
      quoteAmount: ''
    }
  }
  async tryUpdateCurrentTradePair (baseHash?: string, quoteHash?: string) {
    if (baseHash && quoteHash) {
      await this.fetchCurrentTradePairByHash(baseHash, quoteHash)
    } else {
      this.clearCurrentTradePair()
    }
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
          baseAmount: Math.floor(parseFloat(this.formData.baseAmount || '0') * 1e8)
        }
        await this.$store.dispatch('pool/buyTokenInTradePair', requestBody)
      } else {
        const requestBody: pool.PayloadSell = {
          hash: this.currentTradePair.tp_hash.toHex(),
          quoteAmount: Math.floor(parseFloat(this.formData.quoteAmount || '0') * 1e8)
        }
        await this.$store.dispatch('pool/sellTokenInTradePair', requestBody)
      }
    } catch (err) { console.error(err) }
  }
}
</script>
