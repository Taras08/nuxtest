const bodyParser = require('body-parser')
const session    = require('express-session')
const moment     = require('moment')

module.exports = {

  server: {
    activeServer: 1,
    logsRecord: true,

    log4js : {
      appenders: {
        everything: {
          type: 'file',
          filename: `logs/app.${moment().format('DD-MM-YYYY')}.log`,
          maxLogSize: 10458760,
          backups: 100,
          keepFileExt: true,
          daysToKeep: 100,
          compress: true
        }
      },
      categories: {
        default: { appenders: [ 'everything' ], level: 'info' }
      }
    },

  },
  // reset scrollToTop position after change route
  router: {
    scrollBehavior(to, from, savedPosition) {
      // if the returned position is falsy or an empty object,
      // will retain current scroll position.
      let position = false

      // if no children detected
      if (to.matched.length < 2) {
        // scroll to the top of the page
        position = { x: 0, y: 0 }
      } else if (to.matched.some(r => r.components.default.options.scrollToTop)) {
        // if one of the children has scrollToTop option set to true
        position = { x: 0, y: 0 }
      }

      // savedPosition is only available for popstate navigations (back button)
      if (savedPosition) {
        position = savedPosition
      }

      return new Promise(resolve => {
        // wait for the out transition to complete (if necessary)
        // view https://github.com/nuxt/nuxt.js/issues/2738
        /*
         window.$nuxt.$once('triggerScroll', () => {
         // coords will be used if no selector is provided,
         // or if the selector didn't match any element.
         if (to.hash && document.querySelector(to.hash)) {
         // scroll to anchor by returning the selector
         position = { selector: to.hash }
         }
         resolve(position)
         })
         */
        resolve(position)
      })
    },
  },
  target: 'web',
  build: {
    extractCSS: false,
    vendor: [
      'axios',
      'moment'
    ],

    /*
    ** Run ESLint on save
    */
    extend(config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },

  /*
  ** Add server middleware
  ** Nuxt.js uses `connect` module as server
  ** So most of express middleware works with nuxt.js server middleware
  */
  serverMiddleware: [
    // body-parser middleware
    bodyParser.json(),
    // session middleware
    session({
      secret: 'G2Ie0GmR3(E.0sb(v-MN2XY%NoZ2IE',
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 60000 }
    }),
    // Api middleware
    // We add /api/login & /api/logout routes
    '~/api'
  ],

  modules: [
    '@nuxtjs/proxy', // proxy module
  ],
  // proxy config
  proxy: {
    '/proxy-handler': {
      target: 'http://localhost:80',
      pathRewrite: {
        '^/proxy-handler' : '/'
      }
    }
  },

  /*
   ** Customize the progress bar color
   */
  loading: false // { color : 'red' }
}
