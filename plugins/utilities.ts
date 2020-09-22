import { Plugin } from '@nuxt/types'
import Vue from 'vue'
import { TextDecoder } from 'text-encoding'

const eventBus = new Vue()

Vue.filter('u8aToString', function(hex?: Uint8Array) {
  return hex ? new TextDecoder().decode(hex) : ''
})

const thePlugin: Plugin = async (context, inject) => {
  inject('eventBus', eventBus)
}
export default thePlugin
