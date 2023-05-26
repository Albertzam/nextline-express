import { Router } from 'express'
import { DTO } from '../common'
import { AuthMiddleware, ValidateMiddleware } from '../middlewares'

import { getCommentController } from '../controllers/comments/getComment.controller'
import { registerCommentController } from '../controllers/comments/registerComment.controller'

const router = Router()

router.post(
  '/register',
  AuthMiddleware(),
  ValidateMiddleware(DTO.RegisterComment),
  registerCommentController
)

router.get(
  '/find-by-job',
  AuthMiddleware(),
  ValidateMiddleware(DTO.GetComments),
  getCommentController
)
export default router
