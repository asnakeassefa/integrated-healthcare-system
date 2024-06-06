const express = require('express')
const bedController = require('./controller')
const auth = require('../../middlewares/auth')
// create the routes here
const router = express.Router()

router.route('/bookBed').post(auth,bedController.bookBed)
router.route('/getAllBookedBeds').get(bedController.getAllBookedBeds)
router.route('/getPatientBed/:patientId').get(bedController.getPatientBed)
router.route('/freeBed/:bedId').delete(auth,bedController.freeBed)
router.route('/getUnoccupiedBeds').get(bedController.getUnoccupiedBeds)
module.exports = router
