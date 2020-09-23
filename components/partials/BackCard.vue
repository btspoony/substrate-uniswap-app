<template>
  <el-card class="width-100-percent">
    <el-page-header
      slot="header"
      title="Back"
      :content="title"
      @back="goBack"
    />
    <slot />
  </el-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import Identicon from '@polkadot/vue-identicon'
import { User } from '~/types'

@Component({
  components: { Identicon }
})
export default class BackCardComponent extends Vue {
  @Prop({ default: undefined }) readonly title!: string
  // ---- Computed --
  // NOTHING
  // ---- Hooks --
  async mounted () {
    // NOTHING
  }
  // ------ Methods ---
  goBack () {
    this.$router.back()
  }
}
</script>
