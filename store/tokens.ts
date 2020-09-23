import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { TextEncoder, TextDecoder } from 'text-encoding'
import { Option } from '@polkadot/types/codec'
import { Hash } from '@polkadot/types/interfaces/runtime'
import { RootState } from '~/store'
import { User, Token, TokenBalances, TokenDisplay } from '~/types'

export const state = () => ({
  tokens: [] as TokenDisplay[],
  tokenLength: -1
})

export type ModuleState = ReturnType<typeof state>

const mapToDisplay = (tokens: Token[]): TokenDisplay[] => tokens.map(one => ({
  hash: one.token_hash.toHex(),
  symbol: new TextDecoder().decode(one.symbol.toU8a()),
  total_supply: one.total_supply.toNumber(),
  ttype: one.ttype.isNormal ? 'Normal' : 'Liquidity'
}))
export const getters: GetterTree<ModuleState, RootState> = {
  normalTokens: state => state.tokens.filter(one => one.ttype === 'Normal'),
  liquidityTokens: state => state.tokens.filter(one => one.ttype === 'Liquidity')
}

export const mutations: MutationTree<ModuleState> = {
  SETUP_ALL_TOKENS: (state, payload: { tokens: TokenDisplay[] }) => (state.tokens = payload.tokens),
  SET_TOKENS_LENGTH: (state, payload: { len: number }) => (state.tokenLength = payload.len)
}

export const actions: ActionTree<ModuleState, RootState> = {
  /**
   * 获取全部用户和其私钥
   */
  async queryAllTokens (ctx, payload: { isForce?: boolean } = {}) {
    await this.$ensureApiConnected()
    if (!payload.isForce) {
      // 第一次需要获取 index
      const oldLength = ctx.state.tokenLength
      await ctx.dispatch('fetchTokenLengthIndex')
      if (oldLength === ctx.state.tokenLength) return
    }
    const len = ctx.state.tokenLength
    // 从 0 ~ length index 一路查过去
    const tokenIndexes = []
    for (let i = 0; i < len; i++) { tokenIndexes.push(i) }
    // 并发获取信息
    const tokens: Token[] = []
    await Promise.all(tokenIndexes.map(async index => {
      const hash = (await this.$api.query.tokenModule.tokenHashByIndex(index)) as Option<Hash>
      if (hash.isSome) {
        const token = (await this.$api.query.tokenModule.tokens(hash.unwrap())) as Option<Token>
        // push tokens list
        if (token.isSome) tokens.push(token.unwrap())
      }
    }))
    // 需要请求 substrate 获取 tokens
    ctx.commit('SETUP_ALL_TOKENS', { tokens: mapToDisplay(tokens) })
  },
  async fetchTokenLengthIndex (ctx) {
    await this.$ensureApiConnected()
    const len = await this.$api.query.tokenModule.tokenIndex()
    ctx.commit('SET_TOKENS_LENGTH', {
      len: parseInt(len.toHuman()?.valueOf() as string)
    })
    return len
  },
  /**
   * 创建新代币
   * 由 管理员 执行
   */
  async createNewToken (ctx, payload: { symbol: string, totalSupply: number }) {
    await this.$ensureApiConnected()
    const u8array = new TextEncoder().encode(payload.symbol)
    // 构建交易
    const extrinsic = this.$api.tx.tokenModule.issue(u8array.buffer, payload.totalSupply)
    // 交易签名并发送
    const keypair = (ctx.rootGetters['currentUser'] as User)?.keypair
    await extrinsic.signAndSend(keypair, this.$txSendingCallback(async result => {
      // 当 finalized 时，获取最新的 token length
      if (result.isInBlock) {
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
    const keypair = (ctx.rootGetters['currentUser'] as User)?.keypair
    await extrinsic.signAndSend(keypair, this.$txSendingCallback())
  },
  /**
   * 查询代币余额
   */
  async queryTokenBalance (ctx, payload: { tokenHash: string, address: string }) {
    await this.$ensureApiConnected()
    // 查询代币
    const results = await Promise.all([
      this.$api.query.tokenModule.balanceOf([payload.address, payload.tokenHash]),
      this.$api.query.tokenModule.freeBalanceOf([payload.address, payload.tokenHash]),
      this.$api.query.tokenModule.freezedBalanceOf([payload.address, payload.tokenHash])
    ])
    return {
      all: results[0],
      free: results[1],
      frozen: results[2]
    } as TokenBalances
  }
}
