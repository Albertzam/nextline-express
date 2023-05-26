import { HttpStatus, catchAsync } from '../../common'
import { Response } from 'express'
import commentService from '../../services/comment.service'
import { CustomRequest } from '../../common/constants/request'
export const registerCommentController = catchAsync(
  async (req: CustomRequest, res: Response) => {
    res
      .json(
        await commentService.registerComment({
          ...req.body,
          userId: req.user?.userId,
        })
      )
      .status(HttpStatus.CREATED)
  }
)
