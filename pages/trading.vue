<template>
  <div>
    <CurrentUserHeader />
    Trading Page
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { TradePair } from '~/types'
import { ModuleState } from '~/store/pool'

@Component({
  async fetch (ctx) {
    await ctx.store.dispatch('pool/queryTradePairs')
  }
})
export default class PageComponent extends Vue {
  // ---- Computed --
  get availableTradePairs () {
    return (this.$store.state.tokens as ModuleState).tradePairs
  }
  // ---- Hooks --
  async mounted () {
    // NOTHING
  }
  // ------ Methods ---
  // NOTHING
}
</script>
