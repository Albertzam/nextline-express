import { Router } from 'express'
import { DTO } from '../common'
import { AuthMiddleware, ValidateMiddleware } from '../middlewares'
import {
  deleteJobController,
  findAllJobController,
  findOneJobController,
  registerJobController,
  updateJobController,
} from '../controllers'

const router = Router()
router.post(
  '/register',
  AuthMiddleware(),
  ValidateMiddleware(DTO.JobRegister),
  registerJobController
)

router.put(
  '/update',
  AuthMiddleware(),
  ValidateMiddleware(DTO.JobUpdate),
  updateJobController
)

router.delete(
  '/delete',
  AuthMiddleware(),
  ValidateMiddleware(DTO.DeleteGeneral),
  deleteJobController
)

router.get('/find-all', AuthMiddleware(), findAllJobController)

router.get(
  '/find-one',
  AuthMiddleware(),
  ValidateMiddleware(DTO.DeleteGeneral),
  findOneJobController
)

export default router
