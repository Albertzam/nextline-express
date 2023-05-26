import { HttpStatus, catchAsync } from '../../common'
import { Request, Response } from 'express'
import userService from '../../services/user.service'
export const loginUserController = catchAsync(
  async (req: Request, res: Response) => {
    res.json(await userService.login(req.body)).status(HttpStatus.OK)
  }
)
