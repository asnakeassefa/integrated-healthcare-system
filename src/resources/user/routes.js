const express = require('express')
const userController = require('./controller')

const router = express.Router()

// define routes
router.route('/signup').post(userController.signup)
router.route('/login').post(userController.login)
// router.route('/addRole').post(userController.addRole)

module.exports = router
