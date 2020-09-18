<template>
  <el-tabs
    v-model="activeTab"
    :stretch="true"
  >
    <el-tab-pane name="tokens" label="Tokens">
      Content of Tokens
    </el-tab-pane>
    <el-tab-pane name="activities" label="Activities">
      <p>Content of Activities.</p>
      <p>(Working in progress...)</p>
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Token } from '~/types'
import { ModuleState } from '~/store/tokens'

@Component({
  async fetch (ctx) {
    await ctx.store.dispatch('tokens/queryAllTokens')
  }
})
export default class PageComponent extends Vue {
  activeTab = "tokens"
  // ---- Computed --
  get availableTokens () {
    return (this.$store.state.tokens as ModuleState).tokens
  }
  // ---- Hooks --
  async mounted () {
    // NOTHING
  }
  // ------ Methods ---
  // NOTHING
}
</script>
