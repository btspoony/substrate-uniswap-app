import { Plugin } from '@nuxt/types'
import { ApiPromise, WsProvider } from '@polkadot/api'
import { Callback, ISubmittableResult } from '@polkadot/types/types'
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
  // 注入 API 实例
  inject('api', api)
  // 通用验证连接性
  inject('ensureApiConnected', async () => {
    if (!api.isConnected) {
      api = api.clone()
      await api.isReadyOrError
      inject('api', api)
    }
    return api.isConnected
  })
  // 通用交易发送回调
  inject('txSendingCallback', (handlerFunc?: Callback<ISubmittableResult>) => {
    return async (result: ISubmittableResult) => {
      const { status, events, isInBlock, isFinalized } = result
      let txHash
      if (isInBlock) {
        txHash = status.asInBlock.toHex()
      } else if (isFinalized) {
        txHash = status.asFinalized.toHex()
      } else {
        console.log('Status of extrinsic: ' + status.type)
      }
      context.app.$eventBus.$emit('txmsg', { type: 'info', title: status.type, message: txHash })
      /**
       * inblock 时发出提示
       */
      if (isInBlock) {
        for (const evt of events) {
          const isFailed = evt.event.section === 'system' && evt.event.method === 'ExtrinsicFailed'
          await new Promise(resolve => setTimeout(resolve, 0.3))
          context.app.$eventBus.$emit('txmsg', {
            title: evt.event.method,
            type: !isFailed ? 'success' : 'failed'
          })
        }
      }
      // 可选执行
      if (handlerFunc !== undefined) {
        await handlerFunc(result)
      }
    }
  })
}
export default substratePlugin
