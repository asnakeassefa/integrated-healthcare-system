const express = require('express')
const pharmacyController = require('./controller')
// create the routes here
const router = express.Router()

router.route('/addPharmacyOrder').post(pharmacyController.completeOrder)
router.route('/getCompletedOrders').get(pharmacyController.getAllCompletedOrders)
router.route('/getAllPharmacyOrders').get(pharmacyController.getAllPharmacyOrders)
router.route('/getOrderByPharmacistId/:id').get(pharmacyController.getOrderByPharmacistId)
router.route('/getPharmacists').get(pharmacyController.getAllPharmacist)

module.exports = router
