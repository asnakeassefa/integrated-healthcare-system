const express = require('express')

const router = express.Router()

// import routes
const userRouter = require('../resources/user/routes')
const refreshTokenRouter = require('../resources/refreshToken/routes')
const patientRouter = require('../resources/atrPatient/routes')
const drugRouter = require('../resources/drug/routes')
const order = require('../resources/order/routes')
const pharmacy = require('../resources/pharmacy/routes')
const visitRouter = require('../resources/visitHistory/routes')
const currVisit = require('../resources/visit/routes')
const bedRouter = require('../resources/bedBooking/routes')
const bed = require('../resources/bed/routes')
const report = require('../resources/report/routes')
const emergency = require('../resources/emergency/routes')
// Higher level routes definition
router.use('/user', userRouter)
router.use('/refresh', refreshTokenRouter)
router.use('/patient', patientRouter)
router.use('/drug', drugRouter)
router.use('/order', order)
router.use('/pharmacy', pharmacy)
router.use('/visit', visitRouter)
router.use('/patientVisit', currVisit)
router.use('/bed', bedRouter, bed)
router.use('/report', report)
router.use('/emergency', emergency)

module.exports = router
