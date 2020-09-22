<template>
  <div>
    TradePair Detail Page
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { TradePair } from '~/types'
import { ModuleState } from '~/store/pool'

@Component({
  async asyncData (ctx) {
    return { hash: ctx.params['hash'] }
  },
  async validate(ctx) {
    // await operations
    return true // 如果参数有效
    // return false // 将停止Nuxt.js呈现页面并显示错误页面
  }
})
export default class PageComponent extends Vue {
  // ---- Computed --
  // NOTHING
  // ---- Hooks --
  async mounted () {
    // NOTHING
  }
  // ------ Methods ---
  // NOTHING
}
</script>
