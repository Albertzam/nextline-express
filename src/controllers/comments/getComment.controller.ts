import { DTO, HttpStatus, catchAsync } from '../../common'
import { Request, Response } from 'express'
import commentService from '../../services/comment.service'

export const getCommentController = catchAsync(
  async (req: Request, res: Response) => {
    res
      .json(
        await commentService.getComments(
          req.query as unknown as DTO.GetComments
        )
      )
      .status(HttpStatus.CREATED)
  }
)
