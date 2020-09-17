
import { ApiPromise } from '@polkadot/api'

declare module 'vue/types/vue' {
  // this.$api inside Vue components
  interface Vue {
    $api: ApiPromise
  }
}

declare module '@nuxt/types' {
  // nuxtContext.app.$api inside asyncData, fetch, plugins, middleware, nuxtServerInit
  interface NuxtAppOptions {
    $api: ApiPromise
  }
  // nuxtContext.$api
  interface Context {
    $api: ApiPromise
  }
}

declare module 'vuex/types/index' {
  // this.$api inside Vuex stores
  interface Store<S> {
    $api: ApiPromise
  }
}
