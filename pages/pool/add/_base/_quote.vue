<template>
  <div>
    {{ base }} + {{ quote }}
  </div>
</template>

<script lang="ts">
import { Route } from 'vue-router'
import { Vue, Component, Watch } from 'vue-property-decorator'
// import { User } from '~/types'

@Component({
  asyncData ({ params }) {
    return {
      base: params.base,
      quote: params.quote
    }
  }
})
export default class BaseQuoteComponent extends Vue {
  // ---- Computed --
  // NOTHING
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
}
</script>
