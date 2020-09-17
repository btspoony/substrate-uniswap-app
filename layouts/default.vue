<template>
  <Nuxt />
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class LayoutComponent extends Vue {
  async mounted () {
    await this.$store.dispatch('queryAllUsers')
  }
}
</script>
