<template>
  <Identicon
    class="mt-4-1"
    theme="polkadot"
    :size="40"
    :value="currentUser ? currentUser.address : '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY'"
  />
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
  // ---- Hooks --
  async mounted () {
    // NOTHING
  }
}
</script>
