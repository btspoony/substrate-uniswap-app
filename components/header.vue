<template>
  <el-row
    class="app-header align-center"
    :gutter="12"
  >
    <el-col :span="3">
      <el-button
        class="mt-4-1"
        size="large"
        icon="el-icon-menu"
        circle
        @click="toggleMenu"
      ></el-button>
    </el-col>
    <el-col :span="18">
      <h2 class="ellipsis-word">{{ currentUser ? currentUser.address : 'No User' }}</h2>
    </el-col>
    <el-col :span="3">
      <UserPicker @command="handleCommand">
        <CurrentUser />
      </UserPicker>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { User } from '~/types'

@Component
export default class HeaderComponent extends Vue {
  // ---- Computed --
  get currentUser () {
    return this.$store.getters['currentUser'] as User
  }
  // ---- Hooks --
  async mounted () {
    // NOTHING
  }
  // ------ Methods ---
  toggleMenu () {
    this.$store.commit('app/SET_SIDE_MENU_OPENED', true)
  }
  handleCommand (command: number) {
    this.$store.commit('SET_CURRENT_USER', command)
  }
}
</script>
