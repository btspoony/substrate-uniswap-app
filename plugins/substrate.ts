import { Plugin } from '@nuxt/types'
import { ApiPromise, WsProvider } from '@polkadot/api'
import { types } from '~/types/substrate'

/**
 * 异步初始化
 */
const substratePlugin: Plugin = async (context, inject) => {
  const providerUrl = context.env.NODE_URL || 'ws://127.0.0.1:9944'
  let api = await ApiPromise.create({
    provider: new WsProvider(providerUrl),
    types
  }).then(api => {
    // 打印连接成功
    console.log(`Substrate node connected. url: ${providerUrl}`)
    // 断线则重设api
    api.on('disconnected', () => console.log(`node disconnected!!!`))
    return api
  })
  inject('api', api)
  inject('ensureApiConnected', async () => {
    if (!api.isConnected) {
      api = api.clone()
      await api.isReadyOrError
      inject('api', api)
    }
    return api.isConnected
  })
}
export default substratePlugin
