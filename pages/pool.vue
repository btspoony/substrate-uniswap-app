<template>
  <NuxtChild />
</template>

<script lang="ts">
import { Route } from 'vue-router'
import { Vue, Component, Watch } from 'vue-property-decorator'
import { User } from '~/types'

@Component({
  async fetch (ctx) {
    await ctx.store.dispatch('tokens/queryAllTokens')
  }
})
export default class PageComponent extends Vue {
  // ---- Computed --
  get currentUser () { return this.$store.getters['currentUser'] as User }
  // ---- Hooks --
  @Watch('$route')
  onRouteChange (route: Route) {
    this.updateRoute(route.path)
  }
  async mounted () {
    this.updateRoute(this.$route.path)
  }
  // ------ Methods ---
  updateRoute (path: string) {
    // TODO
  }
  // ------ UI Handler ---
  // NOTHING
}
</script>
