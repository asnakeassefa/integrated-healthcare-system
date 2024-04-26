
const express = require('express')
const drugController = require('./controller')

const router = express.Router()

// define routes
router.route('/addDrug').post(drugController.addDrug)
router.route('/getAllDrugs').get(drugController.getAllDrugs)
router.route('/getDrug/:id').get(drugController.getDrugById)
// router.route('/addRole').post(userController.addRole)

module.exports = router
