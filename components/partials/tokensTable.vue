<template>
  <el-table
    class="width-100-percent"
    :data="list"
  >
    <el-table-column label="Symbol" width="80">
      <template slot-scope="scope">
        <p>{{ scope.row.token && scope.row.token.symbol }}</p>
      </template>
    </el-table-column>
    <el-table-column label="Hash" width="280">
      <template slot-scope="scope">
        <span>
          {{ scope.row.token && scope.row.token.hash }}
        </span>
      </template>
    </el-table-column>
    <el-table-column label="Balances">
      <template slot-scope="scope">
        <el-row v-if="scope.row.balances">
          <el-col :span="18">
            <p>Free: {{ scope.row.balances.free | toBalance }}</p>
            <p>Frozen: {{ scope.row.balances.frozen | toBalance }}</p>
          </el-col>
          <el-col :span="6" class="align-right">
            <slot name="operation"/>
          </el-col>
        </el-row>
        <span v-else>loading...</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { User, TokenDisplay, TokenBalances } from '~/types'
import { ModuleState } from '~/store/tokens'

type TableItem = { token: TokenDisplay, balances?: TokenBalances }
@Component
export default class TokenTableComponent extends Vue {
  @Prop(String) readonly tokenKey!: string

  list = [] as TableItem[]
  // ---- Computed --
  get currentUser () { return this.$store.getters['currentUser'] as User }
  get allTokenLength () { return (this.$store.state.tokens as ModuleState).tokenLength }
  get availableTokens () { return this.$store.getters[`tokens/${this.tokenKey}`] as TokenDisplay[] }
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
  async onTokensChange(tokens: TokenDisplay[], oldTokens: TokenDisplay[]) {
    await this.queryTokenBalances(tokens)
  }
  // ---- Hooks --
  async mounted () {
    await this.queryTokenBalances(this.availableTokens)
  }
  // ------ Methods --
  async queryTokenBalances (tokens: TokenDisplay[]) {
    if (!this.currentUser) {
      this.list = tokens.map(token => ({ token }))
      return
    }
    if (tokens.length === 0) return
    // 当前地址
    const address = this.currentUser.address
    // 批量获取 balance
    const balances = await Promise.all(tokens.map(async token => {
      const result: TableItem = { token }
      try {
        result.balances = (await this.$store.dispatch('tokens/queryTokenBalance', {
          tokenHash: token.hash,
          address
        })) as TokenBalances
      } catch (err) { console.error(err) }
      return result
    }))
    // 重置 tokenData
    this.list = balances
  }
}
</script>
