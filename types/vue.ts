
import { ApiPromise } from '@polkadot/api'
import { Callback, ISubmittableResult } from '@polkadot/types/types'

declare module 'vue/types/vue' {
  // this.$api inside Vue components
  interface Vue {
    $api: ApiPromise
    $eventBus: Vue
    $ensureApiConnected():  Promise<boolean>
  }
}

declare module '@nuxt/types' {
  // nuxtContext.app.$api inside asyncData, fetch, plugins, middleware, nuxtServerInit
  interface NuxtAppOptions {
    $api: ApiPromise
    $eventBus: Vue
    $ensureApiConnected():  Promise<boolean>
  }
  // nuxtContext.$api
  interface Context {
    $api: ApiPromise
    $ensureApiConnected():  Promise<boolean>
  }
}

declare module 'vuex/types/index' {
  // this.$api inside Vuex stores
  interface Store<S> {
    $api: ApiPromise
    $eventBus: Vue
    $ensureApiConnected():  Promise<boolean>
    $txSendingCallback: (handlerFunc?: Callback<ISubmittableResult>) => Callback<ISubmittableResult>
  }
}
