import { Router } from 'express'
import userController from './controller'

const router = Router()

// define routes
router.route('/createUser').post(userController.createUser)
router.route('/getAllUsers').get(userController.getAll)
export default router