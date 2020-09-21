import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { TextEncoder } from 'text-encoding'
import { RootState } from '~/store'
import { User, Token, TokenBalances } from '~/types'

export const state = () => ({
  tokens: [] as Token[],
  tokenLength: -1
})

export type ModuleState = ReturnType<typeof state>

export const getters: GetterTree<ModuleState, RootState> = {
}

export const mutations: MutationTree<ModuleState> = {
  SETUP_ALL_TOKENS: (state, payload: Token[]) => (state.tokens = payload),
  SET_TOKENS_LENGTH: (state, payload: number) => (state.tokenLength = payload)
}

export const actions: ActionTree<ModuleState, RootState> = {
  /**
   * 获取全部用户和其私钥
   */
  async queryAllTokens (ctx) {
    await this.$ensureApiConnected()
    let tokens: Token[] = []
    // 从 0 ~ length index 一路查过去
    // TODO 需要请求 substrate 获取 tokens
    ctx.commit('SETUP_ALL_TOKENS', tokens)
  },
  async fetchTokenLengthIndex (ctx) {
    await this.$ensureApiConnected()
    // TODO
    const len = 0
    ctx.commit('SET_TOKENS_LENGTH', len)
  },
  /**
   * 创建新代币
   * 由 管理员 执行
   */
  async createNewToken (ctx, payload: { symbol: string, supply: number }) {
    await this.$ensureApiConnected()
    const u8array = new TextEncoder().encode(payload.symbol)
    // 构建交易
    const extrinsic = this.$api.tx.tokenModule.issue(u8array, payload.supply)
    // 交易签名并发送
    const keypair = (ctx.getters['currentUser'] as User)?.keypair
    await extrinsic.signAndSend(keypair, this.$txSendingCallback(async result => {
      // 当 finalized 时，获取最新的 token length
      if (result.isFinalized) {
        await ctx.dispatch('fetchTokenLengthIndex')
      }
    }))
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
