import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { TextEncoder } from 'text-encoding'
import { RootState } from '~/store'
import { User, Token, TokenBalances } from '~/types'

export const state = () => ({
  tokens: [] as Token[]
})

export type ModuleState = ReturnType<typeof state>

export const getters: GetterTree<ModuleState, RootState> = {
}

export const mutations: MutationTree<ModuleState> = {
  SETUP_ALL_TOKENS: (state, tokens: Token[]) => (state.tokens = tokens)
}

export const actions: ActionTree<ModuleState, RootState> = {
  /**
   * 获取全部用户和其私钥
   */
  async queryAllTokens (ctx) {
    await this.$ensureApiConnected()
    let tokens: Token[] = []
    // TODO 需要请求 substrate 获取 tokens
    ctx.commit('SETUP_ALL_TOKENS', tokens)
  },
  /**
   * 创建新代币
   * 由 管理员 执行
   */
  async createNewToken (ctx, payload: { name: string, supply: number }) {
    await this.$ensureApiConnected()
    const u8array = new TextEncoder().encode(payload.name)
    // 构建交易
    const extrinsic = this.$api.tx.tokenModule.issue(u8array, payload.supply)
    // 交易签名并发送
    const keypair = (ctx.getters['currentUser'] as User)?.keypair
    await extrinsic.signAndSend(keypair, this.$txSendingCallback())
  },
  /**
   * 代币转账
   * 由 持币人 执行
   */
  async transferToken (ctx, payload: { tokenHash: string, to: string, amount: number }) {
    await this.$ensureApiConnected()
    // 构建交易
    const extrinsic = this.$api.tx.tokenModule.transfer(payload.tokenHash, payload.to, payload.amount)
    // 交易签名并发送
    const keypair = (ctx.getters['currentUser'] as User)?.keypair
    await extrinsic.signAndSend(keypair, this.$txSendingCallback())
  },
  /**
   * 查询代币余额
   */
  async queryTokenBalance (ctx, payload: { tokenHash: string, address: string }) {
    await this.$ensureApiConnected()
    // 查询代币
    const results = await Promise.all([
      this.$api.query.tokenModule.balanceOf(payload.address, payload.tokenHash),
      this.$api.query.tokenModule.freeBalanceOf(payload.address, payload.tokenHash),
      this.$api.query.tokenModule.freezedBalanceOf(payload.address, payload.tokenHash)
    ])
    return {
      all: results[0],
      free: results[1],
      frozen: results[2]
    } as TokenBalances
  }
}
