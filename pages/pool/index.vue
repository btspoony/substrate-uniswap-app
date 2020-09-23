<template>
  <el-row v-show="currentUser">
    <el-col :span="22" :offset="1">
      <TokensTable token-key="liquidityTokens">
        <el-button
          slot="operation"
          type="primary"
          icon="el-icon-s-finance"
          @click="removeLiquidityDialogVisible = true"
        ></el-button>
      </TokensTable>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { User } from '~/types'
import { ModuleState } from '~/store/pool'

@Component
export default class RedirectComponent extends Vue {
  removeLiquidityDialogVisible = false
  // ---- Computed --
  get currentUser () {
    return this.$store.getters['currentUser'] as User
  }
  // ---- Hooks --
  async mounted () {
    // NOTHING
  }
  // ---- Methods --
  // NOTHING
  // ---- UI Handler --
  // NOTHING
}
</script>
