const express = require('express')
const visitController = require('./controller')
const router = express.Router()

// define routes
// router.route('/createVisitHistory').post(visitController.updateLastVisit)
router.route('/getAllVisits').get(visitController.getVisits)
router.route('/getPatientVisit/:PatientId').get(visitController.getPatientVisit)
router.route('/getPassedAppointment').get(visitController.getPassedAppointment)

module.exports = router