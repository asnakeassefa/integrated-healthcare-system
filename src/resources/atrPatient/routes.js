const express = require('express')
const userController = require('./controller')
const auth = require('../../middlewares/auth')

const router = express.Router()

router.post('/atrRegister', userController.registerUser)
router.get('/allAtrPatients', userController.getAllPatients)
router.get('/atrPatient:fullName', userController.getPatient)


module.exports = router
