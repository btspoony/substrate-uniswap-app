import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { RootState } from '~/store'
import { Token } from '~/types'

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
    // TODO
  },
  /**
   * 代币转账
   * 由 持币人 执行
   */
  async transferToken (ctx, payload: { to: string, amount: number }) {
    await this.$ensureApiConnected()
    // TODO
  }
}
