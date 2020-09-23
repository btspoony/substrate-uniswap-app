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
import { Vue, Component } from 'vue-property-decorator'
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
  }
})
export default class PageComponent extends Vue {
  formData: FormData = {}
  // ---- Computed --
  get availableTokens () { return this.$store.getters['tokens/normalTokens'] as TokenDisplay[] }
  get availableFromTokens () {
    if (!this.formData.toTokenHash) return this.availableTokens
    const toHash = this.formData.toTokenHash
    return this.availableTokens.filter(one => one.hash !== toHash)
  }
  get availableToTokens () {
    if (!this.formData.fromTokenHash) return this.availableTokens
    const toHash = this.formData.fromTokenHash
    return this.availableTokens.filter(one => one.hash !== toHash)
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

<style lang="scss">
.token-select.el-select .el-input {
  width: 100px;
}
</style>
