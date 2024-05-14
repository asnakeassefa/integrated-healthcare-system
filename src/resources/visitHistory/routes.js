const express = require('express')
const visitController = require('./controller')
const router = express.Router()

// define routes
router.route('/createVisitHistory').post(visitController.createVisit)
router.route('/getAllVisitHistory').get(visitController.getVisits)
router.route('/getPatientVisits/:patientId').get(visitController.getVisitHistoriesByPatientId)
router.route('/getUpcomingAppointments/:days').get(visitController.getUpcomingAppointments)
router.route('/getPassedAppointments').get(visitController.getPassedAppointments)

module.exports = router