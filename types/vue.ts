
import { ApiPromise } from '@polkadot/api'

declare module 'vue/types/vue' {
  // this.$api inside Vue components
  interface Vue {
    $api: ApiPromise
    $ensureApiConnected():  Promise<boolean>
  }
}

declare module '@nuxt/types' {
  // nuxtContext.app.$api inside asyncData, fetch, plugins, middleware, nuxtServerInit
  interface NuxtAppOptions {
    $api: ApiPromise
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
    $ensureApiConnected():  Promise<boolean>
  }
}
