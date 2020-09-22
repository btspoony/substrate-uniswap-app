import { RegistryTypes } from '@polkadot/types/types'
import { TokenDef } from './token'
import { TradePairDef } from './tradePair'

export const types: RegistryTypes = {
  // mapping the actual specified address format
  Address: 'AccountId',
  // mapping Token and TradePair
  Token: TokenDef,
  TradePair: TradePairDef
}
