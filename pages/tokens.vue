<template>
  <el-tabs
    v-show="currentUser"
    v-model="activeTab"
    :stretch="true"
  >
    <el-tab-pane name="tokens" label="Tokens">
      <TokensTable :list="tableData">
        <el-button
          slot="operation"
          type="primary"
          icon="el-icon-s-promotion"
          @click="transferTokenDialogVisible = true"
        ></el-button>
      </TokensTable>
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
  get availableTokens () { return this.$store.getters['tokens/normalTokens'] as Token[] }
  get currentUser () { return this.$store.getters['currentUser'] as User }
  // ---- Watch --
  @Watch('currentUser')
  async onCurrentUserChange() {
    await this.queryTokenBalances(this.availableTokens)
  }
  @Watch('allTokenLength')
  async onTokenLengthChange(newLength: number, oldLength: number) {
    if (newLength > oldLength) {
      await this.$store.dispatch('tokens/queryAllTokens', { isForce: true })
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
    if (!this.currentUser) {
      this.tableData = this.availableTokens.map(token => ({ token }))
      return
    }
    // 当前地址
    const address = this.currentUser.address
    // 批量获取 balance
    const balances = await Promise.all(tokens.map(async token => {
      const result: { token: Token, balances?: TokenBalances } = { token }
      try {
        result.balances = (await this.$store.dispatch('tokens/queryTokenBalance', {
          tokenHash: token.token_hash.toHex(),
          address
        })) as TokenBalances
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
