const pino = require('pino')

const logger = pino({
  name: process.env.APP_ID || 'app',
  level: process.env.LOG_LEVEL || 'info',
})

module.exports = logger
