import { KeyringPair } from '@polkadot/keyring/types'

export class User {
  address: string
  keypair: KeyringPair

  constructor (keypair: KeyringPair) {
    this.keypair = keypair
    this.address = keypair.address
  }
}
