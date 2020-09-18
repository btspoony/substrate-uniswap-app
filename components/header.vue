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
      <h2 class="ellipsis-word">{{ currentUser.address }}</h2>
    </el-col>
    <el-col :span="3">
      <el-dropdown
        @command="handleCommand"
      >
        <Identicon
          class="mt-4-1 cursor-pointer"
          theme="polkadot"
          :size="40"
          :value="currentUser.address"
        />
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="(user, i) in users"
            :key="user.address"
            :command="i"
          >
            {{ user.keypair && user.keypair.meta ? user.keypair.meta.name : user.address }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Identicon from '@polkadot/vue-identicon'
import { User } from '~/types'

@Component({
  components: { Identicon }
})
export default class HeaderComponent extends Vue {
  // ---- Computed --
  get currentUser () {
    return this.$store.getters['currentUser'] as User
  }
  get users () {
    return this.$store.state.availableUsers as User[]
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
