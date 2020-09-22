import { GetterTree, ActionTree, MutationTree } from 'vuex'
import keyring from '@polkadot/ui-keyring'
import { EventRecord } from '@polkadot/types/interfaces/system'
import { User } from '~/types'

export const state = () => ({
  currentUserIndex: 0,
  availableUsers: [] as User[]
})

export type RootState = ReturnType<typeof state>

export const getters: GetterTree<RootState, RootState> = {
  currentUser: state => state.availableUsers[state.currentUserIndex]
}

export const mutations: MutationTree<RootState> = {
  SETUP_AVAILABLE_USERS: (state, users: User[]) => (state.availableUsers = users),
  SET_CURRENT_USER: (state, index: number) => {
    const current = state.availableUsers[index]
    if (!current) {
      throw new Error(`failed to set current user, index should be [0~${state.availableUsers.length - 1}] instead of ${index}`)
    }
    state.currentUserIndex = index
  }
}

export const actions: ActionTree<RootState, RootState> = {
  /**
   * 获取全部用户和其私钥
   */
  async queryAllUsers (ctx) {
    await this.$ensureApiConnected()
    keyring.loadAll({ isDevelopment: true })
    const pairs = keyring.getPairs()
    if (pairs.length > 0) {
      ctx.commit('SETUP_AVAILABLE_USERS', pairs.map(one => new User(one)))
      ctx.commit('SET_CURRENT_USER', 0)
    }
  }
}
