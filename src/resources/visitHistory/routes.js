const express = require('express')
const visitController = require('./controller')
const router = express.Router()

// define routes
router.route('/createVisitHistory').post(visitController.createVisit)
router.route('/getAllVisitHistory').get(visitController.getVisits)
// router.route('/getVisitHistoriesByUserId').get(visitController.getVisitHistoriesByUserId)
// router.route('/getVisitHistoriesByPatientId').get(visitController.getVisitHistoriesByPatientId)
// router.route('/appointmentsWithinFiveDays').get(visitController.getUsersWithAppointmentsWithinFiveDays)

module.exports = router