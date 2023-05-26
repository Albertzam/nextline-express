import { Response } from 'express'
import { HttpStatus, catchAsync } from '../../common'
import productService from '../../services/product.service'
import { CustomRequest } from '../../common/constants/request'

export const registerJobController = catchAsync(
  async (req: CustomRequest, res: Response) => {
    const response = await productService.register({
      ...req.body,
      createdBy: req.user?.userId,
      manager: !req.body.manager ? req.user?.userId : req.body.manager,
    })

    res.send(response).status(HttpStatus.CONTINUE)
  }
)
