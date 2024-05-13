const express = require('express')
const userController = require('./controller')
const auth = require('../../middlewares/auth')

const router = express.Router()

router.post('/atrRegister', auth,userController.registerPatient)
router.get('/allAtrPatients', auth,userController.getAllPatients)
router.get('/atrPatient/:atrId', auth, userController.getPatient)
router.put('/updateAtrPatient/:atrNumber', auth, userController.updatePatient)

module.exports = router
