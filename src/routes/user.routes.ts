import { Router } from 'express'
import { DTO } from '../common'
import { AuthMiddleware, ValidateMiddleware } from '../middlewares'
import { loginUserController, registerUserController } from '../controllers'

const router = Router()

router.post(
  '/register',
  AuthMiddleware(true),
  ValidateMiddleware(DTO.UserRegister),
  registerUserController
)

router.post('/login', ValidateMiddleware(DTO.UserLogin), loginUserController)
export default router
