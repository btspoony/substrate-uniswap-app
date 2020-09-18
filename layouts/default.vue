<template>
  <div class="app-main-layout">
    <el-container>
      <!-- 通用头 -->
      <el-header><Header /></el-header>
      <!-- 内容体 -->
      <el-main><Nuxt /></el-main>
    </el-container>
    <!-- 侧边菜单 -->
    <SideMenu />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component({
  head () {
    return {
      title: 'Uniswap Demo'
    }
  }
})
export default class LayoutComponent extends Vue {
  async mounted () {
    await this.$store.dispatch('queryAllUsers')
  }
}
</script>
