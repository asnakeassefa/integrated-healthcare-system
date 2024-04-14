
const mongoose = require('mongoose')
const logger = require('../common/logger')

// to use env variables
const dotenv = require('dotenv')
dotenv.config()

const DB_URI = process.env.MONGO_URI || process.env.LOCAL_CONNECTION_STRING

mongoose.connect(DB_URI)

mongoose.Promise = global.Promise

// Get current connected Database
const db = mongoose.connection

// Notify on error or success
db.on('error', (err) => logger.error('connection with db error', err))
db.on('close', () => logger.info('connection closed to db'))
db.once('open', () => logger.info(`Connected to the database instance on ${DB_URI}`))

module.exports ={
  Connection: db,
}
