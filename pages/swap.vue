<template>
  <el-row>
    <el-col
      :sm="{ span: 18, offset: 3 }"
      :xs="{ span: 20, offset: 2 }"
    >
      <el-card class="width-100-percent">
        <el-form
          ref="form"
          :model="formData"
          label-position="top"
          label-width="80px"
        >
          <ItemTokenInput
            icon="el-icon-sold-out"
            item-label="From"
            item-prop="fromAmount"
            :amount.sync="formData.fromAmount"
            :hash.sync="formData.fromTokenHash"
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
            item-label="To"
            item-prop="toAmount"
            :amount.sync="formData.toAmount"
            :hash.sync="formData.toTokenHash"
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
import { Component } from 'vue-property-decorator'
import TradePairInfo from '~/components/mixins/tradePairInfo'
import { TokenDisplay, TradePair } from '~/types'
import * as pool from '~/store/pool'

type FormData = {
  fromTokenHash?: string,
  fromAmount?: string,
  toTokenHash?: string,
  toAmount?: string
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
    if (!this.formData.toTokenHash) return this.availableTokens
    const toHash = this.formData.toTokenHash
    return this.availableTokens.filter(one => one.hash !== toHash)
  }
  get availableToTokens () {
    const availableHashs = this.allTradePairs.reduce((result, curr) => {
      const quoteHash = curr.quote.toHex()
      if (result.includes(quoteHash)) return result
      if (!this.formData.fromTokenHash) {
        result.push(quoteHash)
      } else {
        const baseHash = curr.base.toHex()
        if (this.formData.fromTokenHash === baseHash) {
          result.push(quoteHash)
        }
      }
      return result
    }, [] as string[])
    return this.availableTokens.filter(one => availableHashs.includes(one.hash))
  }
  get isFromAmountValid () { return this.isNumber(this.formData.fromAmount) }
  get isToAmountValid () { return this.isNumber(this.formData.toAmount) }
  get isSwapButtonEnabled () {
    return this.formData.fromTokenHash !== '' &&
      this.formData.toTokenHash !== '' &&
      this.isFromAmountValid &&
      this.isToAmountValid
  }
  get swapButtonText () {
    const noFromToken = this.formData.fromTokenHash === ''
    const noToToken = this.formData.toTokenHash === ''
    return noFromToken ? 'Select a token(From)' :
      (noToToken ? 'Select a token(To)' :
      (!this.isFromAmountValid || !this.isToAmountValid ? 'Input an amount' : 'Swap'))
  }
  // ---- Hooks --
  async mounted () {
    this.resetData()
    if (this.availableTokens.length > 0) {
      const firstToken = this.availableTokens[0]
      this.formData.fromTokenHash = firstToken.hash
    }
  }
  // ------ Methods ---
  resetData () {
    this.formData = {
      fromTokenHash: '',
      fromAmount: '',
      toTokenHash: '',
      toAmount: ''
    }
  }
  isNumber (value?: string) {
    const parsed = parseFloat(value || '')
    return !isNaN(parsed) && `${parsed}` === value
  }
  // ------ UI Handler ---
  onChangeFromTo () {
    this.formData = {
      fromTokenHash: this.formData.toTokenHash,
      fromAmount: this.formData.toAmount,
      toTokenHash: this.formData.fromTokenHash,
      toAmount: this.formData.fromAmount
    }
  }
  onTrySwap () {
    // TODO
  }
}
</script>
