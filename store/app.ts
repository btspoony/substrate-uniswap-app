import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { RootState } from '~/store'

export const state = () => ({
  sideMenuOpened: false
})

export type ModuleState = ReturnType<typeof state>

export const getters: GetterTree<ModuleState, RootState> = {
  isSideMenuOpened: state => state.sideMenuOpened
}

export const mutations: MutationTree<ModuleState> = {
  SET_SIDE_MENU_OPENED: (state, payload: boolean) => (state.sideMenuOpened = !!payload),
}

export const actions: ActionTree<ModuleState, RootState> = {
  // NOTHING
}
