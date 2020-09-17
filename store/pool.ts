import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { RootState } from '~/store'

export const state = () => ({
})

export type ModuleState = ReturnType<typeof state>

export const getters: GetterTree<ModuleState, RootState> = {
}

export const mutations: MutationTree<ModuleState> = {
  // CHANGE_NAME: (state, newName: string) => (state.name = newName),
}

export const actions: ActionTree<ModuleState, RootState> = {
  // async fetchThings({ commit }) {
  //   const things = await this.$axios.$get('/things')
  //   console.log(things)
  //   commit('CHANGE_NAME', 'New name')
  // },
}
