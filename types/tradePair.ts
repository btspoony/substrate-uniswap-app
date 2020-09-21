import { Struct } from '@polkadot/types/codec'
import { Hash, Balance, AccountId } from '@polkadot/types/interfaces/runtime'

export interface TradePair extends Struct {
  readonly hash: Hash
  readonly base: Hash
  readonly quote: Hash
  readonly liquidity_token_hash: Hash
  readonly liquidity_token_issued_amount: Balance
  readonly account: AccountId
}

export const TradePairDef = {
  hash: 'Hash',
  base: 'Hash',
  quote: 'Hash',
  liquidity_token_hash: 'Hash',
  liquidity_token_issued_amount: 'Balance',
  account: 'AccountId'
}
