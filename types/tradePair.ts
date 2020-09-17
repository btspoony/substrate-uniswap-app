import { Struct } from '@polkadot/types/codec'
import { H256, Balance, AccountId } from '@polkadot/types/interfaces/runtime'

export interface TradePair extends Struct {
  readonly hash: H256
  readonly base: H256
  readonly quote: H256
  readonly liquidity_token_hash: H256
  readonly liquidity_token_issued_amount: Balance
  readonly account: AccountId
}

export const TradePairDef = {
  hash: 'H256',
  base: 'H256',
  quote: 'H256',
  liquidity_token_hash: 'H256',
  liquidity_token_issued_amount: 'Balance',
  account: 'AccountId'
}
