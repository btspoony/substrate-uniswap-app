<template>
  <NuxtChild />
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({
  async fetch (ctx) {
    await ctx.store.dispatch('tokens/queryAllTokens')
    await ctx.store.dispatch('pool/queryTradePairs')
  }
})
export default class PageComponent extends Vue {
  // ---- Computed --
  // NOTHING
  // ---- Hooks --
  // NOTHING
  // ------ UI Handler ---
  // NOTHING
}
</script>
