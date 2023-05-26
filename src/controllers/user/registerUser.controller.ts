import { HttpStatus, catchAsync } from '../../common'
import { Request, Response } from 'express'
import userService from '../../services/user.service'
export const registerUserController = catchAsync(
  async (req: Request, res: Response) => {
    res.json(await userService.register(req.body)).status(HttpStatus.CREATED)
  }
)
