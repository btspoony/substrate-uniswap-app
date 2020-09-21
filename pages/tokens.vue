<template>
  <el-tabs
    v-show="currentUser"
    v-model="activeTab"
    :stretch="true"
  >
    <el-tab-pane name="tokens" label="Tokens">
      <el-table
        class="width-100-percent"
        :data="tableData"
      >
        <el-table-column label="Symbol" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.token && scope.row.token.symbol && scope.row.token.symbol.toHex() }}</span>
          </template>
        </el-table-column>
        <el-table-column label="Hash" width="240">
          <template slot-scope="scope">
            <span class="ellipsis-word">
              {{ scope.row.token && scope.row.token.hash && scope.row.token.hash.toHex() }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="Balances">
          <template slot-scope="scope">
            <el-row v-if="scope.row.balances">
              <el-col :span="20">
                <p>All: {{ scope.row.balances.all }}</p>
                <p>Free: {{ scope.row.balances.free }}</p>
                <p>Frozen: {{ scope.row.balances.frozen }}</p>
              </el-col>
              <el-col :span="4">
                <el-button
                  class="width-100-percent"
                  type="primary"
                  icon="el-icon-s-promotion"
                  @click="transferTokenDialogVisible = true"
                ></el-button>
              </el-col>
            </el-row>
            <span v-else>loading...</span>
          </template>
        </el-table-column>
      </el-table>
      <el-button
        class="width-100-percent"
        type="primary"
        icon="el-icon-plus"
        @click="newTokenDialogVisible = true"
      >ADD</el-button>
    </el-tab-pane>
    <el-tab-pane name="activities" label="Activities">
      <p>Content of Activities.</p>
      <p>(Working in progress...)</p>
    </el-tab-pane>
    <NewToken :dialog-visible.sync="newTokenDialogVisible" />
    <TransferToken :dialog-visible.sync="transferTokenDialogVisible" />
  </el-tabs>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { User, Token, TokenBalances } from '~/types'
import { ModuleState } from '~/store/tokens'

@Component({
  async fetch (ctx) {
    await ctx.store.dispatch('tokens/queryAllTokens')
  }
})
export default class PageComponent extends Vue {
  activeTab = "tokens"
  tableData = [] as { token: Token, balances?: TokenBalances }[]
  newTokenDialogVisible = false
  transferTokenDialogVisible = false
  // ---- Computed --
  get allTokenLength () { return (this.$store.state.tokens as ModuleState).tokenLength }
  get availableTokens () { return (this.$store.state.tokens as ModuleState).tokens }
  get currentUser () { return this.$store.getters['currentUser'] as User }
  // ---- Watch --
  @Watch('allTokenLength')
  async onTokenLengthChange(newLength: number, oldLength: number) {
    if (newLength > oldLength) {
      await this.$store.dispatch('tokens/queryAllTokens')
    }
  }
  @Watch('availableTokens', { immediate: true, deep: true })
  async onTokensChange(tokens: Token[], oldTokens: Token[]) {
    await this.queryTokenBalances(tokens)
  }
  // ---- Hooks --
  async mounted () {
    await this.queryTokenBalances(this.availableTokens)
  }
  // ------ Methods ---
  async queryTokenBalances (tokens: Token[]) {
    if (!this.currentUser) return
    // 当前地址
    const address = this.currentUser.address
    // 批量获取 balance
    const balances = await Promise.all(tokens.map(async token => {
      const result: { token: Token, balances?: TokenBalances } = { token }
      try {
        const tokenHash = token.hash.toHex()
        result.balances = (await this.$store.dispatch('tokens/queryTokenBalance', { tokenHash, address })) as TokenBalances
      } catch (err) { console.error(err) }
      return result
    }))
    // 重置 tokenData
    this.tableData = balances
  }
  // ------ UI Handler ---
  // NOTHING
}
</script>
