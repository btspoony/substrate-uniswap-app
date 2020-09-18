<template>
  <el-row :gutter="12">
    <el-col :span="4">
      <!-- Menu Toggle -->
    </el-col>
    <el-col :span="16">
      <!-- Center Address -->
    </el-col>
    <el-col :span="4">
      <!-- UserIcon -->
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Identicon from '@polkadot/vue-identicon'

@Component({
  components: { Identicon }
})
export default class HeaderComponent extends Vue {
  async mounted () {
    // NOTHING
  }
}
</script>
