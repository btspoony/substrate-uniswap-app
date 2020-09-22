<template>
  <el-row>
    <el-col
      :sm="{ span: 18, offset: 3 }"
      :xs="{ span: 20, offset: 2 }"
    >
      <el-card class="width-100-percent">
        <el-form
          ref="form"
          :model="dialogData"
          label-position="top"
          label-width="80px"
        >
          <TokenInput
            icon="el-icon-sold-out"
            item-label="From"
            item-prop="fromAmount"
            :amount.sync="dialogData.fromAmount"
            :hash.sync="dialogData.fromTokenHash"
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
          <TokenInput
            icon="el-icon-sell"
            item-label="To"
            item-prop="toAmount"
            :amount.sync="dialogData.toAmount"
            :hash.sync="dialogData.toTokenHash"
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
import { TradePair } from '~/types'
import * as pool from '~/store/pool'
import * as tokens from '~/store/tokens'

type DialogueData = {
  fromTokenHash?: string,
  fromAmount?: string,
  toTokenHash?: string,
  toAmount?: string
}

@Component
export default class PageComponent extends Vue {
  dialogData: DialogueData = {}
  // ---- Computed --
  get availableTokens () { return (this.$store.state.tokens as tokens.ModuleState).tokens }
  get availableFromTokens () {
    if (!this.dialogData.toTokenHash) return this.availableTokens
    const toHash = this.dialogData.toTokenHash
    return this.availableTokens.filter(one => one.token_hash.toHex() !== toHash)
  }
  get availableToTokens () {
    if (!this.dialogData.fromTokenHash) return this.availableTokens
    const toHash = this.dialogData.fromTokenHash
    return this.availableTokens.filter(one => one.token_hash.toHex() !== toHash)
  }
  get isFromAmountValid () { return this.isNumber(this.dialogData.fromAmount) }
  get isToAmountValid () { return this.isNumber(this.dialogData.toAmount) }
  get isSwapButtonEnabled () {
    return this.dialogData.fromTokenHash !== '' &&
      this.dialogData.toTokenHash !== '' &&
      this.isFromAmountValid &&
      this.isToAmountValid
  }
  get swapButtonText () {
    const noFromToken = this.dialogData.fromTokenHash === ''
    const noToToken = this.dialogData.toTokenHash === ''
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
    this.dialogData = {
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
    this.dialogData = {
      fromTokenHash: this.dialogData.toTokenHash,
      fromAmount: this.dialogData.toAmount,
      toTokenHash: this.dialogData.fromTokenHash,
      toAmount: this.dialogData.fromAmount
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
