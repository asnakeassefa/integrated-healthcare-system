const express = require('express')
const emergencyController = require('./controller')
const auth = require('../../middlewares/auth')

const router = express.Router()

router.post('/AddEmergencyPatient', auth,emergencyController.registerEmergencyPatient)
router.get('/AllEmergencyPatients', auth,emergencyController.getAllEmergencyPatients)

module.exports = router
