import { GetterTree, ActionTree, MutationTree } from 'vuex'

export const state = () => ({
})

export type RootState = ReturnType<typeof state>

export const getters: GetterTree<RootState, RootState> = {
}

export const mutations: MutationTree<RootState> = {
  // CHANGE_NAME: (state, newName: string) => (state.name = newName),
}

export const actions: ActionTree<RootState, RootState> = {
  // async fetchThings({ commit }) {
  //   const things = await this.$axios.$get('/things')
  //   console.log(things)
  //   commit('CHANGE_NAME', 'New name')
  // },
}
