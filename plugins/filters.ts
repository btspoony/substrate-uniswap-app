import Vue from 'vue'
import { TextDecoder } from 'text-encoding'

Vue.filter('u8aToString', function(hex?: Uint8Array) {
  return hex ? new TextDecoder().decode(hex) : ''
})
