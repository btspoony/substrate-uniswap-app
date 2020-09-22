const pkg = require('./package')

export default {
  ssr: false,
  /**
   * 环境变量
   */
  env: {
    NODE_URL: 'ws://127.0.0.1:9944',
    VERSION: process.env.npm_package_version || pkg.version
  },
  /*
  ** Nuxt target
  ** See https://nuxtjs.org/api/configuration-target
  */
  target: 'server',
  /*
  ** Headers of the page
  ** See https://nuxtjs.org/api/configuration-head
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /**
   ** Customize the progress bar color
   */
  loading: { color: '#1ACBE6' },
  /**
   * SPA时的Loading
   */
  loadingIndicator: {
    name: 'rectangle-bounce',
    color: '#1ACBE6',
    background: '#FFFFFF'
  },
  /**
   * transition
   */
  layoutTransition: 'layout',
  pageTransition: {
    name: 'page',
    mode: 'out-in'
  },

  /*
  ** Global CSS
  */
  css: [
    // 加载第三方 css
  ],
  /*
  ** Plugins to load before mounting the App
  ** https://nuxtjs.org/guide/plugins
  */
  plugins: [
    '@/plugins/element-ui.js',
    '@/plugins/utilities',
    '@/plugins/substrate'
  ],
  /*
  ** Auto import components
  ** See https://nuxtjs.org/api/configuration-components
  */
  components: true,
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxt/typescript-build',
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/axios'
  ],
  /**
   * axios config
   */
  axios: {
    // proxyHeaders: false
  },
  /*
  ** Build configuration
  ** See https://nuxtjs.org/api/configuration-build/
  */
  build: {
    transpile: [/^element-ui/],
  }
}
