<template>
  <el-table
    class="width-100-percent"
    :data="list"
  >
    <el-table-column label="Symbol" width="80">
      <template slot-scope="scope">
        <p>{{ scope.row.token && scope.row.token.symbol && scope.row.token.symbol.toU8a() | u8aToString }}</p>
      </template>
    </el-table-column>
    <el-table-column label="Hash" width="280">
      <template slot-scope="scope">
        <span>
          {{ scope.row.token && scope.row.token.token_hash && scope.row.token.token_hash.toHex() }}
        </span>
      </template>
    </el-table-column>
    <el-table-column label="Balances">
      <template slot-scope="scope">
        <el-row v-if="scope.row.balances">
          <el-col :span="18">
            <p>Free: {{ scope.row.balances.free | toBalance }}</p>
            <p>Frozen: {{ scope.row.balances.frozen | toBalance }}</p>
          </el-col>
          <el-col :span="6" class="align-right">
            <slot name="operation"/>
          </el-col>
        </el-row>
        <span v-else>loading...</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Token, TokenBalances } from '~/types'

type TableItem = { token: Token, balances?: TokenBalances }

@Component
export default class HeaderComponent extends Vue {
  @Prop() readonly list!: TableItem[]
  // ---- Computed --
  // NOTHING
  // ---- Hooks --
  async mounted () {
    // NOTHING
  }
  // ------ Methods --
  // NOTHING
}
</script>
