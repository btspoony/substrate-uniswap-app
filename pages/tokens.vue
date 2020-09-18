<template>
  <el-tabs
    v-model="activeTab"
    :stretch="true"
  >
    <el-tab-pane name="tokens" label="Tokens">
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column label="Symbol" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.token && scope.row.token.symbol && scope.row.token.symbol.toHex() }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Hash" width="180">
          <template slot-scope="scope">
            <span class="ellipsis-word">
              {{ scope.row.token && scope.row.token.hash && scope.row.token.hash.toHex() }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="Balances">
          <template slot-scope="scope">
            <div v-if="scope.row.balances">
              <p>All: {{ scope.row.balances.all }}</p>
              <p>Free: {{ scope.row.balances.free }}</p>
              <p>Frozen: {{ scope.row.balances.frozen }}</p>
            </div>
            <span v-else>loading...</span>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane name="activities" label="Activities">
      <p>Content of Activities.</p>
      <p>(Working in progress...)</p>
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { Token, TokenBalances } from '~/types'
import { ModuleState } from '~/store/tokens'

@Component({
  async fetch (ctx) {
    await ctx.store.dispatch('tokens/queryAllTokens')
  }
})
export default class PageComponent extends Vue {
  activeTab = "tokens"
  tableData = [] as { token: Token, balances?: TokenBalances }[]
  // ---- Computed --
  get availableTokens () {
    return (this.$store.state.tokens as ModuleState).tokens
  }
  // ---- Watch --
  @Watch('availableTokens', { immediate: true, deep: true })
  onTokensChange(tokens: Token[], oldTokens: Token[]) {
    // TODO start query balances
  }
  // ---- Hooks --
  async mounted () {
    // TODO start query balances
  }
  // ------ Methods ---
  // NOTHING
}
</script>
