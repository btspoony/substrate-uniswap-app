<template>
  <el-form-item
    v-if="currentTradePairBalances"
    label="Information"
  >
    <el-row :gutter="4">
      <el-col :span="2">
        <strong>Pool</strong>
      </el-col>
      <el-col :span="8">
        <span><strong>Price: </strong>{{ poolPrice }}</span>
      </el-col>
      <el-col :span="7">
        <span><strong>{{ currentTradePairBaseSymbol }}: </strong>{{ poolBaseBalance }}</span>
      </el-col>
      <el-col :span="7">
        <span><strong>{{ currentTradePairQuoteSymbol }}: </strong>{{ poolQuoteBalance }}</span>
      </el-col>
    </el-row>
    <el-row :gutter="4">
      <el-col :span="2">
        <strong>Your</strong>
      </el-col>
      <el-col :span="8">
        <span><strong>LT: </strong>{{ ownedLTBalance }}</span>
      </el-col>
      <el-col :span="7">
        <span><strong>{{ currentTradePairBaseSymbol }}: </strong>{{ ownedBaseBalance }}</span>
      </el-col>
      <el-col :span="7">
        <span><strong>{{ currentTradePairQuoteSymbol }}: </strong>{{ ownedQuoteBalance }}</span>
      </el-col>
    </el-row>
  </el-form-item>
  <div v-else></div>
</template>

<script lang="ts">
import { mixins } from 'vue-class-component'
import { Component } from 'vue-property-decorator'
import TradePairInfo from '~/components/mixins/tradePairInfo'

@Component
export default class ItemCurrentTradePairInfoComponent extends mixins(TradePairInfo) {
  // ---- Computed --
  // NOTHING
  // ---- Watch --
  // NOTHING
  // ---- Hooks --
  // NOTHING
  // ---- Methods --
  // NOTHING
}
</script>
