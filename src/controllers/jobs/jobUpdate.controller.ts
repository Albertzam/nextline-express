import { Request, Response } from 'express'
import { HttpStatus, catchAsync } from '../../common'
import productService from '../../services/product.service'
import { CustomRequest } from '../../common/constants/request'

export const updateJobController = catchAsync(
  async (req: CustomRequest, res: Response) => {
    const response = await productService.update({
      ...req.body,
      userId: req.user?.userId,
      manager: req.body.manager ? req.body.manager : req.user?.userId,
    })

    res.send(response).status(HttpStatus.OK)
  }
)
