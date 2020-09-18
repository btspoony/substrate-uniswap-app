<template>
  <el-drawer
    direction="ltr"
    :with-header="false"
    :visible.sync="isOpened"
  >
    <div class="app-side-menu">
      这里是Menu内容
    </div>
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
  // ---- Hooks --
  async mounted () {
    // NOTHING
  }
  // ---- Methods --
}
</script>
