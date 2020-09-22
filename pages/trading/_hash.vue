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
