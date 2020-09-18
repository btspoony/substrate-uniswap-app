<template>
  <div>
    Tokens Page
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({
  async fetch (ctx) {
    await this.$store.dispatch('tokens/queryAllTokens')
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
