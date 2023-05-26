import moment from 'moment'
import { DTO } from '../common'
import { STATUS_DB } from '../common/constants/status.db'
import connection from '../db/connection'
import { HttpException } from '../middlewares'
import { ErrorCodesApi } from '../middlewares/errors/error.constants'
class CommentService {
  async getComments(
    comment: DTO.GetComments
  ): Promise<Array<DTO.ResponseComment>> {
    const page = comment.page - 1
    const offset = page * comment.limit

    return await connection.query(
      `SELECT comments.comment,
        JSON_OBJECT('name', user.name, 'email', user.email, 'id', user.id) AS usuario
        FROM comments
        JOIN user ON comments.user_id = user.id
        JOIN jobs ON jobs.id = comments.job_id
        WHERE comments.job_id = ? AND jobs.status != ?
        LIMIT ${comment.limit} OFFSET ${offset}`,
      [comment.jobId, STATUS_DB.ELIMINATED]
    )
  }

  async registerComment(
    comment: DTO.RegisterComment
  ): Promise<DTO.ResponseComment> {
    const exist = (
      await connection.query(
        `
          SELECT jobs.id FROM jobs
          LEFT JOIN shared ON shared.job_id = jobs.id
          WHERE (jobs.status != ? AND jobs.id = ? ) AND (shared.user_id = ? OR  jobs.createdBy = ? OR jobs.isPublic = 1) `,
        [STATUS_DB.ELIMINATED, comment.jobId, comment.userId, comment.userId]
      )
    )[0]

    if (!exist)
      throw new HttpException('Job not found', ErrorCodesApi.JOB_NOT_FOUND)

    await connection.query<string | number, DTO.ResponseComment>(
      `
          INSERT INTO comments (job_id,user_id,comment,createdAt) VALUES (?, ?, ?,?)
        `,
      [
        comment.jobId,
        comment.userId,
        comment.comment,
        moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      ]
    )
    return (
      await connection.query<number, DTO.ResponseComment>(
        `SELECT comments.comment,
          JSON_OBJECT('name', user.name, 'email', user.email, 'id', user.id) AS usuario
          FROM comments
          JOIN user ON comments.user_id = user.id
          WHERE comments.id = LAST_INSERT_ID()`,
        [comment.jobId]
      )
    )[0]
  }
}

export default new CommentService()
