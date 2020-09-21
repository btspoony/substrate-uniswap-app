import { Struct, Vec } from '@polkadot/types/codec'
import { Hash, Balance } from '@polkadot/types/interfaces/runtime'
import { u8 } from '@polkadot/types/primitive'

export interface Token extends Struct {
	readonly token_hash: Hash
	readonly symbol: Vec<u8>
	readonly total_supply: Balance
}

export const TokenDef = {
  token_hash: 'Hash',
  symbol: 'Vec<u8>',
  total_supply: 'Balance'
}

export type TokenBalances = {
  all: Balance
  free: Balance
  frozen: Balance
}
