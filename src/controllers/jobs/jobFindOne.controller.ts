import { Response } from 'express'
import { HttpStatus, catchAsync } from '../../common'
import productService from '../../services/product.service'
import { CustomRequest } from '../../common/constants/request'

export const findOneJobController = catchAsync(
  async (req: CustomRequest, res: Response) => {
    const response = await productService.findOne({
      ...(req.query as any),
      userId: req.user?.userId,
    })

    res.json(response).status(HttpStatus.OK)
  }
)
