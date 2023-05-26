import { Response } from 'express'
import { HttpStatus, catchAsync } from '../../common'
import productService from '../../services/product.service'
import { CustomRequest } from '../../common/constants/request'

export const deleteJobController = catchAsync(
  async (req: CustomRequest, res: Response) => {
    const response = await productService.delete({
      ...(req.query as any),
      userId: req.user?.userId ? req.user.userId : 0,
    })

    res.send(response).status(HttpStatus.OK)
  }
)
