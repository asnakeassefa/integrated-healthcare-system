const express = require('express')
const userController = require('./controller')
const auth = require('../../middlewares/auth')

const router = express.Router()

// define routes
router.route('/signup').post(userController.signup)
router.route('/login').post(userController.login)
router.route('/getUsers').get(auth,userController.getusers)
router.route('/veryfyUser').post(auth,userController.verifyUser)
router.route('/getUnverifiedUsers').get(auth,userController.getUnverifiedUsers)
// router.route('/addRole').post(userController.addRole)

module.exports = router
