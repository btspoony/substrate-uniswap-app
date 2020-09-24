<template>
  <el-dropdown
    class="cursor-pointer"
    @command="command"
  >
    <slot />
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
</template>

<script lang="ts">
import { Vue, Component, Emit } from 'vue-property-decorator'
import { User } from '~/types'

@Component
export default class UserPickerComponent extends Vue {
  // ---- Computed --
  get users () {
    return this.$store.state.availableUsers as User[]
  }
  // ---- Hooks --
  async mounted () {
    // NOTHING
  }
  // ------ Methods ---
  @Emit()
  command(index: number) {
    return index
  }
}
</script>
