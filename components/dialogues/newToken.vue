<template>
  <el-dialog
    title="New Token"
    :visible.sync="visible"
    width="50%">
    <el-form
      ref="form"
      :model="dialogData"
      label-width="120px"
    >
      <el-form-item
        label="Symbol"
        :rules="[
          { required: true, message: 'Please input symbol.', trigger: 'blur' },
          { min: 3, max: 5, message: 'Symbol should be 3 ~ 5 length.', trigger: 'blur' }
        ]"
      >
        <el-input
          v-model="dialogData.symbol"
          placeholder="Please input token symbol."
        ></el-input>
      </el-form-item>
      <el-form-item
        label="TotalSupply"
        :rules="[
          { required: true, message: 'Please input total supply.', trigger: 'blur' }
        ]"
      >
        <el-input-number
          class="width-100-percent"
          v-model="dialogData.totalSupply"
          controls-position="right"
          :step="1e6"
          :min="1"
          :max="1e30"
        ></el-input-number>
      </el-form-item>
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
      this.dialogData = { symbol: '', totalSupply: 1e9 }
    }
  }
  // ---- Hooks --
  async mounted () {
    // NOTHING
  }
  // ---- Methods --
  async onTryConfirm () {
    try {
      await this.$store.dispatch('tokens/createNewToken', this.dialogData)
    } catch (err) { console.error(err) }
    this.visible = false
  }
}
</script>
