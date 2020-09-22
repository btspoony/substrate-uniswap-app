import { Plugin } from '@nuxt/types'
import Vue from 'vue'
import { TextDecoder } from 'text-encoding'

const eventBus = new Vue()
const RATE = 1e8

Vue.filter('u8aToString', function(hex?: Uint8Array) {
  return hex ? new TextDecoder().decode(hex) : ''
})

Vue.filter('toBalance', function(value: number | string | { toString: Function }) {
  let valueInt: number
  if (typeof value === 'number') {
    valueInt = value
  } else if (typeof value === 'string' || typeof value === 'object') {
    try {
      valueInt = parseInt(typeof value === 'object' ? value.toString() : value)
    } catch (err) {
      return value
    }
  } else {
    return value
  }
  return valueInt / RATE
})

const thePlugin: Plugin = async (context, inject) => {
  inject('eventBus', eventBus)
}
export default thePlugin
