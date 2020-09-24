<template>
  <el-dialog
    :visible.sync="visible"
    :title="`Transfer Token -${currentToken.symbol}`"
    width="50%">
    <el-form
      ref="form"
      :model="dialogData"
      label-width="100px"
    >
      <el-form-item
        label="To Account"
        prop="to"
        :rules="[
          { required: true, message: 'Please select account.', trigger: 'change' }
        ]"
      >
        <el-row>
          <el-col :span="17">
            <el-input
              :value="dialogData.to"
              placeholder="Select an account ==>"
              disabled
            />
          </el-col>
          <el-col :span="6" :offset="1">
            <UserPicker @command="onPickUser">
              <el-link type="primary" :underline="false">
                {{ dialogData.name || 'Select' }}<i class="el-icon-arrow-down el-icon--right"></i>
              </el-link>
            </UserPicker>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item
        label="Amount"
        prop="amount"
        :rules="[
          { required: true, type: 'number', min: 0.00000001, message: 'Please input positive amount.', trigger: 'blur' }
        ]"
      >
        <el-input-number
          class="width-100-percent"
          v-model="dialogData.amount"
          controls-position="right"
          :min="0"
        ></el-input-number>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">CANCEL</el-button>
      <el-button
        type="primary"
        :disabled="!isTransferable"
        @click="onTryConfirm"
      >TRANSFER</el-button>
    </span>
  </el-dialog>
</template>

<script lang="ts">
import { Vue, Component, PropSync, Watch } from 'vue-property-decorator'
import { User, TokenDisplay } from '~/types'

@Component
export default class TransferTokenDialogueComponent extends Vue {
  dialogData = { to: '', amount: 0, name: '' }
  @PropSync('dialogVisible', { type: Boolean }) visible!: boolean
  // ---- Computed --
  get users () { return this.$store.state.availableUsers as User[] }
  get currentToken () { return this.$store.getters['tokens/activeToken'] as TokenDisplay || { symbol: '' } }
  get isTransferable () {
    return this.dialogData.amount > 0 && !!this.dialogData.to
  }
  // ---- Watch --
  @Watch('dialogVisible')
  onVisibleChange (newVal: boolean, oldVal: boolean) {
    if (newVal) {
      this.dialogData = { to: '', amount: 0, name: '' }
    } else {
      const form = this.$refs['form'] as any
      form.clearValidate()
    }
  }
  // ---- Hooks --
  async mounted () {
    // NOTHING
  }
  // ---- Methods --
  onPickUser (index: number) {
    const user = this.users[index]
    this.dialogData.to = user.address
    this.dialogData.name = (user.keypair.meta as any).name || ''
  }
  async onTryConfirm () {
    const form = this.$refs['form'] as any
    const isOk = await form.validate()
    if (!isOk) return
    // 验证通过，调用请求
    try {
      await this.$store.dispatch('tokens/transferToken', {
        tokenHash: this.currentToken.hash,
        to: this.dialogData.to,
        amount: Math.floor(this.dialogData.amount * 1e8)
      })
    } catch (err) { console.error(err) }
    this.visible = false
  }
}
</script>
