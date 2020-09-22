<template>
  <el-dialog
    title="New TradePair"
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
      <el-button type="primary" @click="onTryConfirm">CREATE</el-button>
    </span>
  </el-dialog>
</template>

<script lang="ts">
import { Vue, Component, PropSync, Watch } from 'vue-property-decorator'

@Component
export default class NewTokenDialogueComponent extends Vue {
  dialogData = {}
  // ---- Computed --
  @PropSync('dialogVisible', { type: Boolean }) visible!: boolean
  // ---- Watch --
  @Watch('dialogVisible')
  onVisibleChange (newVal: boolean, oldVal: boolean) {
    if (newVal) {
      this.dialogData = {}
    }
  }
  // ---- Hooks --
  async mounted () {
    // NOTHING
  }
  // ---- Methods --
  async onTryConfirm () {
    const form = this.$refs['form'] as any
    const isOk = await form.validate()
    if (!isOk) return
    // 验证通过，调用请求
    try {
      await this.$store.dispatch('pool/createNewTradePair', this.dialogData)
    } catch (err) { console.error(err) }
    form.clearValidate()
    this.visible = false
  }
}
</script>
