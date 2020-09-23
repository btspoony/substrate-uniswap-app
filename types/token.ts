import { Struct, Vec, Enum } from '@polkadot/types/codec'
import { Hash, Balance } from '@polkadot/types/interfaces/runtime'
import { u8 } from '@polkadot/types/primitive'

export interface TokenType extends Enum {
  readonly isNormal: boolean
  readonly isLiquidity: boolean
}

export const TokenTypeDef = {
  _enum: [ 'Normal', 'Liquidity' ]
}

export interface Token extends Struct {
	readonly token_hash: Hash
	readonly symbol: Vec<u8>
  readonly total_supply: Balance
  readonly ttype: TokenType
}

export const TokenDef = {
  token_hash: 'Hash',
  symbol: 'Vec<u8>',
  total_supply: 'Balance',
  ttype: 'TokenType'
}

export type TokenDisplay = {
  hash: string,
  symbol: string,
  total_supply: string,
  ttype: 'Normal' | 'Liquidity'
}

export type TokenBalances = {
  all: Balance
  free: Balance
  frozen: Balance
}
