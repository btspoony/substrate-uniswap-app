<template>
  <el-dialog
    title="Transfer Token"
    :visible.sync="visible"
    width="50%">
    <el-form
      ref="form"
      :model="dialogData"
      label-width="120px"
    >
      <!-- TODO -->
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">CANCEL</el-button>
      <el-button type="primary" @click="onTryConfirm">TRANSFER</el-button>
    </span>
  </el-dialog>
</template>

<script lang="ts">
import { Vue, Component, PropSync, Watch } from 'vue-property-decorator'

@Component
export default class TransferTokenDialogueComponent extends Vue {
  dialogData = {}
  // ---- Computed --
  @PropSync('dialogVisible', { type: Boolean }) visible!: boolean
  // ---- Watch --
  @Watch('dialogVisible')
  onVisibleChange (newVal: boolean, oldVal: boolean) {
    if (newVal) {
      this.dialogData = {} // TODO
    }
  }
  // ---- Hooks --
  async mounted () {
    // NOTHING
  }
  // ---- Methods --
  async onTryConfirm () {
    // try {
    //   await this.$store.dispatch('tokens/createNewToken', this.dialogData)
    // } catch (err) { console.error(err) }
    this.visible = false
  }
}
</script>
