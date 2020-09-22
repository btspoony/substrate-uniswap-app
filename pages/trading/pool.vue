<template>
  <el-row>
    <el-col
      :sm="{ span: 18, offset: 3 }"
      :xs="{ span: 20, offset: 2 }"
    >
      <el-card class="width-100-percent">
        TradePair Pool Page
      </el-card>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { TradePair } from '~/types'
import { ModuleState } from '~/store/pool'

@Component
export default class PageComponent extends Vue {
  // ---- Computed --
  // NOTHING
  // ---- Hooks --
  async mounted () {
    // NOTHING
  }
  // ------ Methods ---
  // NOTHING
}
</script>
