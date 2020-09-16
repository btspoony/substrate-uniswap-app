import Vue from 'vue'
import Element from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'

Vue.use(Element, { locale, size: 'small' })

/**
 * 导入css
 */
export default async ({ app, store, redirect, error }) => {
  // 导入主要css
  await import('~/assets/scss/index.scss')
  // await import('~/assets/scss/element-variables.scss')
}
