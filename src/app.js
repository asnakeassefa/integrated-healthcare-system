const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const compression = require('compression')
const routes = require('./common/routes')
const unknownEndpoint = require('./middlewares/unknownEndpoint')

// to use env variables
const dotenv = require('dotenv')
dotenv.config()

const app = express()

// middleware
app.disable('x-powered-by')
app.use(cors())
app.use(helmet())
app.use(compression())
app.use(
  express.urlencoded({
    extended: true,
    limit: process.env.REQUEST_LIMIT || '100kb',
  }),
)
app.use(express.json())

// health check
app.get('/', (req, res) => {
  res.status(200).json({
    'health-check': 'OK: top level api working',
  })
})

app.use('/v1/', routes)

// Handle unknown endpoints
app.use('*', unknownEndpoint)

module.exports = app
