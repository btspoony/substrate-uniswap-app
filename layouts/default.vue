<template>
  <el-container>
    <!-- 通用头 -->
    <el-header><Header /></el-header>
    <!-- 内容体 -->
    <el-main><Nuxt /></el-main>
    <!-- 侧边菜单 -->
    <SideMenu />
  </el-container>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({
  head () {
    return {
      title: 'Uniswap Demo'
    }
  },
  async fetch (ctx) {
    await ctx.store.dispatch('queryAllUsers')
  }
})
export default class LayoutComponent extends Vue {
  async mounted () {
    // NOTHING
  }
}
</script>
