<template>
  <div>
    Header
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Identicon from '@polkadot/vue-identicon'

@Component({
  components: { Identicon }
})
export default class HeaderComponent extends Vue {
  async mounted () {
    // NOTHING
  }
}
</script>
