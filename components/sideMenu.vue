<template>
  <el-drawer
    direction="ltr"
    :with-header="false"
    :visible.sync="isOpened"
  >
    <el-menu
      class="app-side-menu"
      default-active="tokens"
      :router="true"
      @select="menuSelected"
    >
      <el-menu-item
        index="tokens"
        route="/tokens"
        :class="[{ 'is-active': currentMenu === 'tokens' }]"
      >
        <i class="el-icon-s-finance"></i>
        <span slot="title">Tokens</span>
      </el-menu-item>
      <el-menu-item
        index="trading"
        route="/trading/swap"
        :class="[{ 'is-active': currentMenu === 'trading' }]"
      >
        <i class="el-icon-s-marketing"></i>
        <span slot="title">Trading</span>
      </el-menu-item>
    </el-menu>
  </el-drawer>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class SideMenuComponent extends Vue {
  // ---- Computed --
  get isOpened () {
    return this.$store.getters['app/isSideMenuOpened'] as boolean
  }
  set isOpened (value: boolean) {
    this.$store.commit('app/SET_SIDE_MENU_OPENED', value)
  }
  get currentMenu () { return this.$route.path.split('/')[1] }
  // ---- Hooks --
  async mounted () {
    // NOTHING
  }
  // ---- Methods --
  /**
   * 菜单选择，关闭 menu
   */
  menuSelected () {
    this.isOpened = false
  }
}
</script>
