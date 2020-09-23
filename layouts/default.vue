<template>
  <div class="app-main-layout">
    <div v-if="$nuxt.isOffline">You are offline</div>
    <el-container>
      <!-- 通用头 -->
      <el-header><Header /></el-header>
      <!-- 内容体 -->
      <el-main>
        <CurrentUserHeader />
        <Nuxt />
      </el-main>
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
      this.$notify({
        title: info.title || '',
        message: this.$createElement('p', { class: 'ellipsis-word' }, info.message),
        type: info.type,
        duration: 2000
      })
    })
  }
}
</script>
