import { RegistryTypes } from '@polkadot/types/types'
import { TokenDef, TokenTypeDef } from './token'
import { TradePairDef } from './tradePair'

export const types: RegistryTypes = {
  // mapping the actual specified address format
  Address: 'AccountId',
  // mapping Token and TradePair
  TokenType: TokenTypeDef,
  Token: TokenDef,
  TradePair: TradePairDef
}
