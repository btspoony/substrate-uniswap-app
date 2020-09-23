<template>
  <el-form-item
    :label="itemLabel"
    :prop="itemProp"
    :rules="[
      { required: true, validator: isValueNumber, trigger: 'blur' }
    ]"
  >
    <el-input
      placeholder="0.0"
      :prefix-icon="icon"
      v-model="amountValue"
    >
      <el-select
        slot="append"
        class="token-select"
        v-model="hashValue"
        placeholder="Token"
      >
        <el-option
          v-for="(token,i) in tokens"
          :key="'token_'+i"
          :label="token.symbol"
          :value="token.hash"
        ></el-option>
      </el-select>
    </el-input>
  </el-form-item>
</template>

<script lang="ts">
import { Vue, Component, Prop, PropSync } from 'vue-property-decorator'
import { TokenDisplay } from '~/types'

@Component
export default class TokenInputComponent extends Vue {
  @PropSync('amount', { type: String }) amountValue!: string
  @PropSync('hash', { type: String }) hashValue!: string
  @Prop() readonly tokens!: TokenDisplay[]
  @Prop(String) readonly icon!: string
  @Prop({ default: 'Item' }) readonly itemLabel!: string
  @Prop(String) readonly itemProp!: string
  // ---- Computed --
  // NOTHING
  // ---- Hooks --
  async mounted () {
    // NOTHING
  }
  // ---- Methods --
  isValueNumber (rule: any, value: any, callback?: Function) {
    let invalid
    try {
      const to = parseFloat(value || '')
      invalid = isNaN(to) || `${to}` !== value
    } catch (err) {}
    if (callback !== undefined) {
      callback(invalid ? new Error('Please input number.') : undefined)
    } else {
      return !invalid
    }
  }
}
</script>

<style lang="scss">
.token-select.el-select .el-input {
  width: 100px;
}
</style>
