import Vue from 'vue'
import Element from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'
// 修改部分主题变量
import('~/assets/scss/element-variables.scss')

Vue.use(Element, { locale, size: 'small' })

/**
 * 导入css
 */
export default async (context, inject) => {
  // 导入项目 scss
  await import('~/assets/scss/index.scss')
}
