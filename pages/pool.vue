<template>
  <NuxtChild />
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import * as pool from '~/store/pool'

@Component({
  async fetch (ctx) {
    await ctx.store.dispatch('tokens/queryAllTokens')
    await ctx.store.dispatch('pool/queryTradePairs')
  }
})
export default class PageComponent extends Vue {
  // ---- Computed --
  get tpLength () { return (this.$store.state.pool as pool.ModuleState).tradePairLength }
  @Watch('tpLength')
  async onTokenLengthChange(newLength: number, oldLength: number) {
    if (newLength > oldLength) {
      await this.$store.dispatch('pool/queryTradePairs', { isForce: true })
    }
  }
  // ---- Hooks --
  // NOTHING
  // ------ UI Handler ---
  // NOTHING
}
</script>
