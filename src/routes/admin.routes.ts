import { Router } from 'express'
import { DTO } from '../common'
import { AuthMiddleware, ValidateMiddleware } from '../middlewares'
import { adminController } from '../controllers'

const router = Router()

router.get(
  '/find-all',
  AuthMiddleware(true),
  ValidateMiddleware(DTO.SearchByQuery),
  adminController
)

export default router
