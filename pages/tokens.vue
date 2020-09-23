<template>
  <el-row v-show="currentUser">
    <el-col :span="22" :offset="1">
      <el-tabs
        v-show="currentUser"
        v-model="activeTab"
        :stretch="true"
      >
        <el-tab-pane name="tokens" label="Tokens">
          <TokensTable token-key="normalTokens">
            <el-button
              slot="operation"
              type="primary"
              icon="el-icon-s-promotion"
              @click="transferTokenDialogVisible = true"
            ></el-button>
          </TokensTable>
          <el-button
            class="width-100-percent"
            type="primary"
            icon="el-icon-plus"
            @click="newTokenDialogVisible = true"
          >ADD TOKEN</el-button>
        </el-tab-pane>
        <el-tab-pane name="activities" label="Activities">
          <p>Content of Activities.</p>
          <p>(Working in progress...)</p>
        </el-tab-pane>
        <NewToken :dialog-visible.sync="newTokenDialogVisible" />
        <TransferToken :dialog-visible.sync="transferTokenDialogVisible" />
      </el-tabs>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { User } from '~/types'
import { ModuleState } from '~/store/tokens'

@Component({
  async fetch (ctx) {
    await ctx.store.dispatch('tokens/queryAllTokens')
  }
})
export default class PageComponent extends Vue {
  activeTab = "tokens"
  newTokenDialogVisible = false
  transferTokenDialogVisible = false
  // ---- Computed --
  get currentUser () { return this.$store.getters['currentUser'] as User }
  // ---- Hooks --
  async mounted () {
    // NOTHING
  }
  // ------ Methods ---
  // NOTHING
  // ------ UI Handler ---
  // NOTHING
}
</script>
