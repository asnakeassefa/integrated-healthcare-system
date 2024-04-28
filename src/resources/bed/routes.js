const express = require('express')
const bedController = require('./controller')
const auth = require('../../middlewares/auth')
// create the routes here
const router = express.Router()

router.route('/addBed').post(auth,bedController.addBed)
router.route('/getBeds').get(bedController.getBeds)

module.exports = router
