const express = require('express')
const refreshController = require('./controller')
const router = express.Router()

router.route('/').post(refreshController.refresh)

module.exports = router