<template>
  <el-dialog
    :visible.sync="visible"
    :title="`Remove Liquidity - ${currentTradePairBaseSymbol}/${currentTradePairQuoteSymbol}`"
    width="640px">
    <el-form
      ref="form"
      :model="dialogData"
      label-position="top"
    >
      <ItemCurrentTradePairInfo />
      <el-form-item
        label="Amount"
        prop="amount"
        :rules="[
          { required: true, type: 'number', min: 0.00000001, message: 'Please input positive amount.', trigger: 'blur' }
        ]"
      >
        <el-input-number
          v-model="dialogData.amount"
          controls-position="right"
          :min="0"
          :max="ownedLTBalance"
        ></el-input-number>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">CANCEL</el-button>
      <el-button
        type="primary"
        :disabled="!isExecutable"
        @click="onTryConfirm"
      >REMOVE LIQUIDITY</el-button>
    </span>
  </el-dialog>
</template>

<script lang="ts">
import { mixins } from 'vue-class-component'
import { Vue, Component, PropSync, Watch } from 'vue-property-decorator'
import TradePairInfo from '~/components/mixins/tradePairInfo'
import { User, TokenDisplay } from '~/types'
import * as pool from '~/store/pool'

@Component
export default class RemoveLiquidityDialogueComponent extends mixins(TradePairInfo) {
  dialogData = { amount: 0 }
  @PropSync('dialogVisible', { type: Boolean }) visible!: boolean
  // ---- Computed --
  get allTradePairs () { return (this.$store.state.pool as pool.ModuleState).tradePairs }
  get currentToken () { return this.$store.getters['tokens/activeToken'] as TokenDisplay || { symbol: '' } }
  get isExecutable () {
    return this.dialogData.amount > 0 && this.dialogData.amount <= this.ownedLTBalance
  }
  // ---- Watch --
  @Watch('currentToken')
  async onActiveTokenChange (newVal: TokenDisplay) {
    let foundAndSet = false
    if (newVal) {
      const foundTradepair = this.allTradePairs.find(one => one.liquidity_token_hash.toHex() === newVal.hash)
      if (foundTradepair) {
        foundAndSet = true
        await this.fetchCurrentTradePairByHash(foundTradepair.base.toHex(), foundTradepair.quote.toHex())
      }
    }
    if (!foundAndSet) {
      this.clearCurrentTradePair()
    }
  }
  @Watch('dialogVisible')
  onVisibleChange (newVal: boolean, oldVal: boolean) {
    if (newVal) {
      this.dialogData = { amount: 0 }
    } else {
      const form = this.$refs['form'] as any
      form.clearValidate()
    }
  }
  // ---- Hooks --
  async mounted () {
    // NOTHING
  }
  // ---- Methods --
  async onTryConfirm () {
    const form = this.$refs['form'] as any
    const isOk = await form.validate()
    if (!isOk) return
    // 验证通过，调用请求
    try {
      const requestBody: pool.PayloadRemoveLiquidity = {
        hash: this.currentTradePair.tp_hash.toHex(),
        ltAmount: Math.floor(this.dialogData.amount * 1e8)
      }
      await this.$store.dispatch('pool/removeLiquidityFromTradePair', requestBody)
    } catch (err) { console.error(err) }
    this.visible = false
  }
}
</script>
