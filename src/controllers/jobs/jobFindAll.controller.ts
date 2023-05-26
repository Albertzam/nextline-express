import { Request, Response } from 'express'
import { HttpStatus, catchAsync } from '../../common'
import productService from '../../services/product.service'
import { CustomRequest } from '../../common/constants/request'

export const findAllJobController = catchAsync(
  async (req: CustomRequest, res: Response) => {
    const response = await productService.findAll(req.user?.userId as number)

    res.json(response).status(HttpStatus.OK)
  }
)
