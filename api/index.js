/* eslint-disable */
// Import express server, router, session and started server
const express = require('express')
const app = express()
const router = express.Router() // Create express router
const session = require('express-session') // https://www.npmjs.com/package/express-session
// Import other modules
const bodyParser = require('body-parser')
const jwt = require('jwt-simple')
const moment = require('moment')
// Import nuxt.config.js and his settings
const config = require('../nuxt.config.js')
// Import request and created global config for this module
const request = require('request').defaults({
  rejectUnauthorized: false,
})

// Created global middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.text({ limit: '100mb' }))
app.use(bodyParser.raw({ limit: '100mb' }))
//app.use(xmlparser());

// Created jwt secret token
app.set('jwtTokenSecret', '*O&T&^nf^T^22%^B69n^^^A()mava!911QdQ^^%@!')

app.set('trust proxy', 1) // trust first proxy
app.use(
  session({
    secret: '9OtX6jNJydKi8tKJoitTILWENNe8hlOD',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, expires: new Date(Date.now() + 60 * 60 * 1000) },
  }),
)

app.enable('trust proxy')
app.set('trust proxy', true)

router.use((req, res, next) => {
  Object.setPrototypeOf(req, app.request)
  Object.setPrototypeOf(res, app.response)
  req.res = res
  res.req = req
  next()
})

if(config.server.logsRecord) {
  const log4js = require('log4js')
  log4js.configure(config.server.log4js)
  const logger = log4js.getLogger('127.0.0.1')

  router.use((req, res, next) => {
    const obj = req.body
    const str = `IP: ${req.connection.remoteAddress} URL: ${req.method} ${req.originalUrl}`

    if(obj.token != undefined) {
      const decoded = jwt.decode(obj.token, app.get('jwtTokenSecret'))
      if(moment(decoded.exp) <= moment(Date.now())) {
        logger.info(`403 - ${str}`)
        req.session.destroy()
        res.status(403).send({ status: 403 })
      } else {
        logger.info(`200 - ${str}`)
        next()
      }
    } else {
      logger.info(`200 - ${str}`)
      next()
    }
  })
}

require('./sign-in/auth')(router, jwt, app)
require('./logout')(router)

// Export the server middleware
module.exports = {
  path: '/api',
  handler: router,
}
