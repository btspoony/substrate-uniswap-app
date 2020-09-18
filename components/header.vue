<template>
  <el-row
    class="app-header align-center"
    :gutter="12"
  >
    <el-col :span="3">
      <el-button
        size="large"
        icon="el-icon-menu"
        circle
        @click="toggleMenu"
      ></el-button>
    </el-col>
    <el-col :span="18">
      Address
    </el-col>
    <el-col :span="3">
      User
      <!-- UserIcon -->
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Identicon from '@polkadot/vue-identicon'

@Component({
  components: { Identicon }
})
export default class HeaderComponent extends Vue {
  // ---- Hooks --
  async mounted () {
    // NOTHING
  }
  // ------ Methods ---
  toggleMenu () {
    this.$store.commit('app/SET_SIDE_MENU_OPENED', true)
  }
}
</script>
