<template>
  <el-row v-show="currentUser">
    <el-col :span="22" :offset="1">
      <TokensTable
        class="mb-8-1"
        tokenKey="liquidityTokens"
        :isBalanceDetailed="false"
      >
        <template v-slot:operation="{ token }">
          <el-button
            slot="operation"
            type="primary"
            icon="el-icon-receiving"
            @click="openRemoveLiquidityDialogue(token)"
          ></el-button>
        </template>
      </TokensTable>
      <el-row :gutter="8">
        <el-col :span="12">
          <el-button
            class="width-100-percent"
            icon="el-icon-plus"
            @click="$router.push('/pool/create')"
          >CREATE PAIR</el-button>
        </el-col>
        <el-col :span="12">
          <el-button
            type="primary"
            class="width-100-percent"
            icon="el-icon-upload2"
            @click="$router.push('/pool/add')"
          >ADD LIQUIDITY</el-button>
        </el-col>
      </el-row>
      <RemoveLiquidity :dialog-visible.sync="removeLiquidityDialogVisible"/>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { User, TokenDisplay } from '~/types'
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
  openRemoveLiquidityDialogue (picked: { token: TokenDisplay }) {
    this.$store.commit('tokens/SET_ACTIVE_TOKEN', picked.token)
    this.removeLiquidityDialogVisible = true
  }
}
</script>
