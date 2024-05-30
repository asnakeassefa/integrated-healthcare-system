
const express = require('express')
const drugController = require('./controller')

const router = express.Router()

// define routes
router.route('/addDrug').post(drugController.addDrug)
router.route('/getAllDrugs').get(drugController.getAllDrugs)
router.route('/getDrug/:id').get(drugController.getDrugById)
router.route('/updateDrug/:id').put(drugController.updateDrug)
router.route('/deleteDrug/:id').delete(drugController.deleteDrug)
router.route('/upcomingExpireDate/:days').get(drugController.upcomingExpireDate)
router.route('/DispencedDrugCount/:days').get(drugController.getDispencedDrugCount)
router.route('/getTotalDrugDispnced').get(drugController.getTotalDispencedDrugCount)

module.exports = router