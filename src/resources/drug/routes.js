
const express = require('express')
const drugController = require('./controller')

const router = express.Router()

// define routes
router.route('/addDrug').post(drugController.addDrug)
router.route('/getAllDrugs').get(drugController.getAllDrugs)
router.route('/getDrug/:id').get(drugController.getDrugById)
router.route('/updateDrug/:id').put(drugController.updateDrug)
router.route('/deleteDrug/:id').delete(drugController.deleteDrug)
router.route('/removeBatch').delete(drugController.removeByBatch)
router.route('/upcomingExpireDate/:days').get(drugController.upcomingExpireDate)
router.route('/DispencedDrugCount/:days').get(drugController.getDispencedDrugCount)
router.route('/getTotalDrugDispenced').get(drugController.getTotalDispencedDrugCount)
router.route('/getTotalDrugDispencedByName').get(drugController.getTotalDispenceByName)
router.route('/getDrugDispencedByDays/:days').get(drugController.getDrugsDispenced)
router.route('/getDrugDispencedByName/:days').get(drugController.getDrugsDispencedByName)
module.exports = router