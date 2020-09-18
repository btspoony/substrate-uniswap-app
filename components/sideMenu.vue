<template>
  <el-drawer
    title="Menu"
    direction="ltr"
    :visible.sync="isOpened"
  >
    这里是Menu内容
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
    this.$store.commit('SET_SIDE_MENU_OPENED', value)
  }
  // ---- Methods --
  async mounted () {
    // NOTHING
  }
}
</script>
