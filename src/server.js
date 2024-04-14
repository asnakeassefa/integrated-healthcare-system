const app = require('./app')
const os = require('os');
const logger = require('./common/logger');
const mongodb = require('./services/db');

// to use env variables
require('dotenv').config();

const PORT = process.env.PORT

app.listen(PORT, () => {
  logger.info(`up and running in ${process.env.NODE_ENV || 'development'} @: ${os.hostname()} on port ${PORT}`)
  mongodb.Connection
})
