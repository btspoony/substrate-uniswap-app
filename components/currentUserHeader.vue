<template>
  <el-row v-if="currentUser">
    <el-col :span="4" class="align-center">
      <CurrentUser />
    </el-col>
    <el-col :span="20" style="line-height: 50px">
      <h1>{{ currentUser.keypair && currentUser.keypair.meta ? currentUser.keypair.meta.name : currentUser.address }}</h1>
    </el-col>
  </el-row>
  <div v-else></div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { User } from '~/types'

@Component
export default class CurrentUserHeaderComponent extends Vue {
  // ---- Computed --
  get currentUser () {
    return this.$store.getters['currentUser'] as User
  }
  // ---- Hooks --
  async mounted () {
    // NOTHING
  }
}
</script>
