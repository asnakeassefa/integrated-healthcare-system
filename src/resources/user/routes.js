const express = require('express')
const userController = require('./controller')
const auth = require('../../middlewares/auth')

const router = express.Router()

// define routes
router.route('/signup').post(auth,userController.signup)
router.route('/login').post(userController.login)
router.route('/getUsers').get(auth,userController.getusers)
// router.route('/addRole').post(userController.addRole)

module.exports = router
