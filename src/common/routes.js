const express = require('express')

const router = express.Router()

// import routes
const userRouter = require('../resources/user/routes')
const refreshTokenRouter = require('../resources/refreshToken/routes')
const patientRouter = require('../resources/patient/routes')
// const visitRouter = require('../resources/visit/routes')

// Higher level routes definition
router.use('/user', userRouter)
router.use('/refresh', refreshTokenRouter)
router.use('/patient', patientRouter)
// router.use('/visit',visitRouter)

module.exports = router
