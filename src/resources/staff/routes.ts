import { Router } from 'express'
import staffController from './controller'
const router = Router()


// define routes
router.route('/createStaff').post(staffController.createStaff)
router.route('/getAllStaff').get(staffController.getAll)

export default router
