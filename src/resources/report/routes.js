const express = require('express')
const reportController = require('./controller')
const auth = require('../../middlewares/auth')
const { report } = require('process')
// create the routes here
const router = express.Router()

router.route('/totalPatient').get(reportController.getNumberOfPatients)
router.route('/SeverePatients').get(reportController.getSeverePatients)
router.route('/newRegistrationsThisMonth').get(reportController.getNewRegistrationsThisMonth)
router.route('/newRegistrationsThisYear').get(reportController.getNewRegistrationsThisYear)
router.route('/menAndWomen').get(reportController.getNumberOfMenAndWomen)
router.route('/totalPatientbyAge').get(reportController.getPatientsByAge)
module.exports = router
