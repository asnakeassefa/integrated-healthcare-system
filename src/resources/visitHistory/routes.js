const express = require('express')
const visitController = require('./controller')
const router = express.Router()
const auth = require('../../middlewares/auth')

// define routes
router.route('/createVisitHistory').post(auth,visitController.createVisit)
router.route('/getAllVisitHistory').get(auth,visitController.getVisits)
router.route('/getPatientVisits/:patientId').get(auth,visitController.getVisitHistoriesByPatientId)
router.route('/getUpcomingAppointments/:days').get(auth,visitController.getUpcomingAppointments)
router.route('/getPassedAppointments').get(auth,visitController.getPassedAppointments)

module.exports = router