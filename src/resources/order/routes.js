const express = require('express')
const orderController = require('./controller')
const auth = require('../../middlewares/auth')
// create the routes here
const router = express.Router()

router.route('/addOrder').post(auth,orderController.addOrder)
router.route('/getOrders').get(orderController.getOrders)
router.route('/getOrderById/:id').get(orderController.getOrderById)
router.route('/getOrderByPatientId/:id').get(orderController.getOrdersByPatientId)
router.route('deleteOrder/:id').delete(auth,orderController.deleteOrder)
router.route('updateOrder/:id').put(auth,orderController.updateOrder)

module.exports = router
