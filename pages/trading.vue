<template>
  <div>
    <CurrentUserHeader />
    <el-tabs
      :stretch="true"
      v-show="currentUser"
      v-model="activeTab"
      @tab-click="onHandleTabClick"
    >
      <el-tab-pane name="swap" label="Swap" />
      <el-tab-pane name="pool" label="Pool" />
    </el-tabs>
    <NuxtChild />
  </div>
</template>

<script lang="ts">
import { Route } from 'vue-router'
import { Vue, Component, Watch } from 'vue-property-decorator'
import { User } from '~/types'

@Component
export default class PageComponent extends Vue {
  activeTab = "swap"
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
    const lastPath = path.split('/').pop()
    this.activeTab = lastPath || 'swap'
  }
  // ------ UI Handler ---
  onHandleTabClick (tabPane: any) {
    this.$router.push(tabPane.name)
  }
}
</script>
