import { HttpStatus, catchAsync } from '../../common'
import { Request, Response } from 'express'
import adminService from '../../services/admin.service'

export const adminController = catchAsync(
  async (req: Request, res: Response) => {
    res
      .json(await adminService.searchByWord(req.query))
      .status(HttpStatus.CREATED)
  }
)
