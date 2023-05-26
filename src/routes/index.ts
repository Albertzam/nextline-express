import { Router } from 'express'

import productsRoutes from './job.routes'
import userRoutes from './user.routes'
import commentRoutes from './comments.routes'
import adminRoutes from './admin.routes'
export default (router: Router) => {
  router.use('/product', productsRoutes)
  router.use('/user', userRoutes)
  router.use('/comment', commentRoutes)
  router.use('/admin', adminRoutes)
}
