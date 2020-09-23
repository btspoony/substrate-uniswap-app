<template>
  <el-row>
    <el-col
      :sm="{ span: 18, offset: 3 }"
      :xs="{ span: 20, offset: 2 }"
    >
    <BackCard title="Create TradePair">
      <NuxtChild v-if="availableTokens.length > 0"/>
      <div v-else>No Token</div>
    </BackCard>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { TokenDisplay } from '~/types'
// import { ModuleState } from '~/store/pool'

@Component
export default class CreatePairPageComponent extends Vue {
  // ---- Computed --
  get availableTokens () { return this.$store.getters['tokens/normalTokens'] as TokenDisplay[] }
  // ---- Hooks --
  async mounted () {
    const params = this.$route.params
    if (this.availableTokens.length > 0 && params.base === undefined) {
      const firstToken = this.availableTokens[0]
      const symbol = firstToken.symbol.trim()
      this.$router.replace(this.$route.path + '/' + symbol)
    }
  }
  // ------ Methods ---
  // NOTHING
}
</script>
