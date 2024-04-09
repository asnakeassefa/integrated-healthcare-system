import { Router } from 'express'

const router: Router = Router()

// import routes
import userRouter from '../resources/users/routes'
import visitRouter from '../resources/visit/routes'
import staffRouter from '../resources/staff/routes'

// Higher level routes definition
router.use('/user', userRouter)
router.use('/visit',visitRouter)
router.use('/staff',staffRouter)

export default router
