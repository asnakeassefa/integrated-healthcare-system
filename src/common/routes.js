const express = require('express')

const router = express.Router()

// import routes
const userRouter = require('../resources/user/routes')
// const visitRouter = require('../resources/visit/routes')

// Higher level routes definition
router.use('/user', userRouter)
// router.use('/visit',visitRouter)

module.exports = router
