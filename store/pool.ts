import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { RootState } from '~/store'
import { TradePair, User } from '~/types'

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
  async createNewTradePair (ctx, payload: { base: string, quote: string }) {
    await this.$ensureApiConnected()
    // 构建交易
    const extrinsic = this.$api.tx.swapModule.create_trade_pair(payload.base, payload.quote)
    // 交易签名并发送
    const keypair = (ctx.rootGetters['currentUser'] as User)?.keypair
    await extrinsic.signAndSend(keypair, this.$txSendingCallback())
  },
  /**
   * 添加流动性
   * 由 持币人 执行
   */
  async addLiquidityToTradePair (ctx, payload: { hash: string, baseAmount: number, quoteAmount?: number }) {
    await this.$ensureApiConnected()
    // 构建交易
    const extrinsic = this.$api.tx.swapModule.add_liquidity(payload.hash, payload.baseAmount, payload.quoteAmount)
    // 交易签名并发送
    const keypair = (ctx.rootGetters['currentUser'] as User)?.keypair
    await extrinsic.signAndSend(keypair, this.$txSendingCallback())
  },
  /**
   * 移出流动性
   * 由 流动性供应商 执行
   */
  async removeLiquidityFromTradePair (ctx, payload: { hash: string, ltAmount: number }) {
    await this.$ensureApiConnected()
    // 构建交易
    const extrinsic = this.$api.tx.swapModule.remove_liquidity(payload.hash, payload.ltAmount)
    // 交易签名并发送
    const keypair = (ctx.rootGetters['currentUser'] as User)?.keypair
    await extrinsic.signAndSend(keypair, this.$txSendingCallback())
  },
  /**
   * 从交易池中以买方操作 Swap
   * 由 持币人 执行
   */
  async buyTokenInTradePair (ctx, payload: { hash: string, baseAmount: number }) {
    await this.$ensureApiConnected()
    // 构建交易
    const extrinsic = this.$api.tx.swapModule.swap_buy(payload.hash, payload.baseAmount)
    // 交易签名并发送
    const keypair = (ctx.rootGetters['currentUser'] as User)?.keypair
    await extrinsic.signAndSend(keypair, this.$txSendingCallback())
  },
  /**
   * 从交易池中以卖方操作 Swap
   * 由 持币人 执行
   */
  async sellTokenInTradePair (ctx, payload: { hash: string, quoteAmount: number }) {
    await this.$ensureApiConnected()
    // 构建交易
    const extrinsic = this.$api.tx.swapModule.swap_sell(payload.hash, payload.quoteAmount)
    // 交易签名并发送
    const keypair = (ctx.rootGetters['currentUser'] as User)?.keypair
    await extrinsic.signAndSend(keypair, this.$txSendingCallback())
  }
}
