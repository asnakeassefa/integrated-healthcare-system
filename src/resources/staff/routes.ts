import { Router } from 'express'
import userController from './controller'

const router = Router()

// define routes
router.route('/').get(userController.getAllStaff)
router.route('/:id').get(userController.getStaffById)

export default router
