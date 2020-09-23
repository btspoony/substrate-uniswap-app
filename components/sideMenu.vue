<template>
  <el-drawer
    direction="ltr"
    :with-header="false"
    :visible.sync="isOpened"
  >
    <el-menu
      class="app-side-menu"
      :router="true"
      @select="menuSelected"
    >
      <el-menu-item
        v-for="menu in menus"
        :key="menu.name"
        :index="menu.name"
        :route="menu.route || `/${menu.name}`"
        :class="[{ 'is-active': currentMenu === menu.name }]"
      >
        <i v-if="!!menu.icon" :class="menu.icon" />
        <span slot="title">{{ menu.label }}</span>
      </el-menu-item>
    </el-menu>
  </el-drawer>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class SideMenuComponent extends Vue {
  menus = [
    { name: 'tokens', label: 'Tokens', icon: 'el-icon-s-finance' },
    { name: 'swap', label: 'Swap', icon: 'el-icon-s-marketing' },
    { name: 'pool', label: 'Pool', icon: 'el-icon-box' }
  ]
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
