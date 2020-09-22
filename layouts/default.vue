<template>
  <div class="app-main-layout">
    <div v-if="$nuxt.isOffline">You are offline</div>
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

type TxMsgInfo = {
  title?: string
  message: string
  type: 'success' | 'warning' | 'info' | 'error'
}

@Component({
  head () {
    return { title: 'Uniswap Demo' }
  }
})
export default class LayoutComponent extends Vue {
  async mounted () {
    await this.$store.dispatch('queryAllUsers')
    // 添加时间监听
    this.$eventBus.$on('txmsg', (info: TxMsgInfo) => {
      const message = (info.title ? `<h3>${info.title}</h3>` : '') + info.message
      this.$message({
        message,
        type: info.type,
        showClose: true,
        dangerouslyUseHTMLString: true
      })
    })
  }
}
</script>
