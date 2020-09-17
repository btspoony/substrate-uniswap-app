import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { RootState } from '~/store'
import { TradePair } from '~/types'

export const state = () => ({
  currentIndex: 0,
  tradePairs: [] as TradePair[]
})

export type ModuleState = ReturnType<typeof state>

export const getters: GetterTree<ModuleState, RootState> = {
  currentTradePair: state => state.tradePairs[state.currentIndex]
}

export const mutations: MutationTree<ModuleState> = {
  SETUP_ALL_TRADE_PAIRS: (state, arr: TradePair[]) => (state.tradePairs = arr),
  SET_CURRENT_TRADE_PAIR: (state, index: number) => {
    const current = state.tradePairs[index]
    if (!current) {
      throw new Error(`failed to set trade pair, index should be [0~${state.tradePairs.length - 1}] instead of ${index}`)
    }
    state.currentIndex = index
  }
}

export const actions: ActionTree<ModuleState, RootState> = {
  /**
   * 查询全部交易对
   */
  async queryTradePairs (ctx) {
    await this.$ensureApiConnected()
    let all: TradePair[] = []
    // TODO 需要请求 substrate 获取 tokens
    ctx.commit('SETUP_ALL_TRADE_PAIRS', all)
  },
  /**
   * 创建交易对
   * 由 管理员 执行
   */
  async createNewTradePair (ctx, payload: any) {
    await this.$ensureApiConnected()
    // TODO
  },
  /**
   * 添加流动性
   * 由 持币人 执行
   */
  async addLiquidityToTradePair (ctx, payload: any) {
    await this.$ensureApiConnected()
    // TODO
  },
  /**
   * 移出流动性
   * 由 流动性供应商 执行
   */
  async removeLiquidityFromTradePair (ctx, payload: any) {
    await this.$ensureApiConnected()
    // TODO
  },
  /**
   * 从交易池中以买方操作 Swap
   * 由 持币人 执行
   */
  async buyTokenInTradePair (ctx, payload: any) {
    await this.$ensureApiConnected()
    // TODO
  },
  /**
   * 从交易池中以卖方操作 Swap
   * 由 持币人 执行
   */
  async sellTokenInTradePair (ctx, payload: any) {
    await this.$ensureApiConnected()
    // TODO
  }
}
