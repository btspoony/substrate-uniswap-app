import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { Option } from '@polkadot/types/codec'
import { Hash } from '@polkadot/types/interfaces/runtime'
import { RootState } from '~/store'
import { TradePair, User } from '~/types'

export const state = () => ({
  currentIndex: 0,
  tradePairs: [] as TradePair[],
  tradePairLength: -1
})

export type ModuleState = ReturnType<typeof state>

export const getters: GetterTree<ModuleState, RootState> = {
  currentTradePair: state => state.tradePairs[state.currentIndex]
}

export const mutations: MutationTree<ModuleState> = {
  SETUP_ALL_TRADE_PAIRS: (state, payload: { tradePairs: TradePair[] }) => (state.tradePairs = payload.tradePairs),
  SET_CURRENT_TRADE_PAIR: (state, index: number) => {
    const current = state.tradePairs[index]
    if (!current) {
      throw new Error(`failed to set trade pair, index should be [0~${state.tradePairs.length - 1}] instead of ${index}`)
    }
    state.currentIndex = index
  },
  SET_TRADE_PAIR_LENGTH: (state, payload: { len: number }) => (state.tradePairLength = payload.len)
}

export const actions: ActionTree<ModuleState, RootState> = {
  /**
   * 查询全部交易对
   */
  async queryTradePairs (ctx) {
    await this.$ensureApiConnected()
    // 第一次需要获取 index
    if (ctx.state.tradePairLength === -1) {
      await ctx.dispatch('fetchTradePairsLength')
    }
    const len = ctx.state.tradePairLength
    // 从 0 ~ length index 一路查过去
    const indexes = []
    for (let i = 0; i < len; i++) { indexes.push(i) }
    // 并发获取信息
    const tradePairs = (await Promise.all(indexes.map(async index => {
      const hash = (await this.$api.query.swapModule.tradePairsHashByIndex(index)) as Option<Hash>
      if (hash.isSome) {
        const token = (await this.$api.query.swapModule.tradePairs(hash.unwrap())) as Option<TradePair>
        return token.isSome ? token.unwrap() : null
      }
      return null
    }))).filter(one => one !== null)
    // 需要请求 substrate 获取 tokens
    ctx.commit('SETUP_ALL_TRADE_PAIRS', { tradePairs })
  },
  /**
   * 获取交易对数量
   */
  async fetchTradePairsLength (ctx) {
    await this.$ensureApiConnected()
    const len = await this.$api.query.swapModule.tradePairsIndex()
    ctx.commit('SET_TRADE_PAIR_LENGTH', {
      len: parseInt(len.toHuman()?.valueOf() as string)
    })
    return len
  },
  /**
   * 获取交易对
   */
  async fetchTradePairByBaseQuote (ctx, payload: { base: string, quote: string }) {
    const hash = (await this.$api.query.swapModule.tradePairsHashByBaseQuote([payload.base, payload.quote])) as Option<Hash>
    if (hash.isSome) {
      const tpHash = hash.unwrap()
      const cached = ctx.state.tradePairs.find(tp => tp.tp_hash.toHex() === tpHash.toHex())
      if (cached) return cached
      // 获取实时数据
      const result = (await this.$api.query.swapModule.tradePairs(tpHash)) as Option<TradePair>
      if (result.isSome) return result.unwrap()
    }
    return null
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
