import { RegistryTypes } from '@polkadot/types/types'
import { TokenDef } from './token'
import { TradePairDef } from './tradePair'

export const types: RegistryTypes = {
  Token: TokenDef,
  TradePair: TradePairDef
}
