import { DTO } from '../common'
import { STATUS_DB } from '../common/constants/status.db'
import { HttpException } from '../middlewares'
import { ErrorCodesApi } from '../middlewares/errors/error.constants'
import connection from '../db/connection'

class JobService {
  async register(data: DTO.JobRegister): Promise<DTO.JobResponse> {
    const newJob = (
      await connection.query<
        string | number | boolean | Date,
        { insertId: number }
      >(
        ` INSERT INTO jobs
        (title, description, isPublic, createdBy, manager,tags, status, submittedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?,?)`,
        [
          data.title,
          data.description,
          data.isPublic,
          data.createdBy as number,
          data.manager as number,
          data.tags,
          STATUS_DB.ACTIVE,
          data.submittedAt,
        ]
      )
    )[0]

    if (data.userShared)
      for (const user of data.userShared) {
        await connection.query(
          `INSERT INTO shared (job_id, user_id) VALUES (?, ?)`,
          [newJob.insertId, user]
        )
      }

    return (
      await connection.query<string | number | boolean, DTO.JobResponse>(
        ` SELECT id, title, description, status, submittedAt, tags FROM jobs
          WHERE jobs.id = ?`,
        [newJob.insertId]
      )
    )[0]
  }

  async update(data: DTO.JobUpdate): Promise<DTO.JobResponse> {
    const exist = (
      await connection.query(
        ` SELECT * FROM jobs
          LEFT JOIN shared ON shared.job_id = jobs.id
          WHERE jobs.id = ? AND (shared.user_id = ? OR jobs.createdBy = ? OR jobs.isPublic = 1)`,
        [data.id, data.userId, data.userId]
      )
    )[0]

    if (!exist)
      throw new HttpException('Job not found', ErrorCodesApi.JOB_NOT_FOUND)

    await connection.query('DELETE FROM shared WHERE job_id = ?', [data.id])
    if (data.userShared) {
      for (const user of data.userShared) {
        await connection.query(
          `INSERT INTO shared (job_id, user_id) VALUES (?, ?)`,
          [data.id, user]
        )
      }
    }
    await connection.query<string | number | boolean, DTO.JobResponse>(
      'UPDATE jobs SET title = ?, description = ?,  tags = ?, isPublic = ?, manager = ?, status = ? WHERE id = ?',
      [
        data.title,
        data.description,
        data.tags,
        data.isPublic,
        data.manager,
        data.status,
        data.id,
      ]
    )
    return (
      await connection.query<number, DTO.JobResponse>(
        ` SELECT jobs.id, jobs.title, jobs.description, jobs.status, jobs.isPublic, jobs.status, jobs.submittedAt,
        jobs.manager,
          IFNULL((SELECT JSON_ARRAYAGG(JSON_OBJECT('name', user.name, 'email', user.email, 'id', user.id))
           FROM shared JOIN user ON shared.user_id = user.id
           WHERE shared.job_id = jobs.id),
           JSON_ARRAY()) AS usuarios,
        JSON_OBJECT('name', manager.name, 'email', manager.email, 'id', manager.id) as manager,
        JSON_OBJECT('name', created.name, 'email', created.email, 'id', created.id) as createdBy
        FROM jobs
        LEFT JOIN shared ON jobs.id = shared.job_id
        LEFT JOIN user ON shared.user_id = user.id
        LEFT JOIN user AS manager ON jobs.manager = manager.id
        LEFT JOIN user AS created ON jobs.createdBy = created.id
        WHERE jobs.id = ? and (shared.user_id = ? or jobs.createdBy = ?)
        GROUP BY jobs.id`,
        [data.id, data.userId, data.userId]
      )
    )[0]
  }

  async delete(data: DTO.DeleteGeneral): Promise<DTO.DeleteGeneral> {
    const exist = (
      await connection.query<string | number, DTO.JobResponse>(
        ` SELECT * FROM jobs
          LEFT JOIN shared ON shared.job_id = jobs.id
          WHERE jobs.id = ? AND (shared.user_id = ? OR jobs.createdBy = ?)`,
        [data.id, data.userId, data.userId]
      )
    )[0]

    if (!exist)
      throw new HttpException('Job not found', ErrorCodesApi.JOB_NOT_FOUND)
    else if (exist.status == STATUS_DB.ELIMINATED)
      throw new HttpException(
        'Job already deleted',
        ErrorCodesApi.JOB_ALREADY_DELETED
      )

    await connection.query('UPDATE jobs SET status = ? WHERE id = ?', [
      STATUS_DB.ELIMINATED,
      data.id,
    ])
    return data
  }

  async findOne(data: DTO.DeleteGeneral): Promise<DTO.JobResponse> {
    const exist = (
      await connection.query<number | string, DTO.JobResponse>(
        ` SELECT jobs.id, jobs.title, jobs.description, jobs.status, jobs.isPublic, jobs.status, jobs.submittedAt,
          jobs.manager,
            IFNULL((SELECT JSON_ARRAYAGG(JSON_OBJECT('name', user.name, 'email', user.email, 'id', user.id))
             FROM shared JOIN user ON shared.user_id = user.id
             WHERE shared.job_id = jobs.id),
             JSON_ARRAY()) AS usuarios,
          JSON_OBJECT('name', manager.name, 'email', manager.email, 'id', manager.id) as manager,
          JSON_OBJECT('name', created.name, 'email', created.email, 'id', created.id) as createdBy
          FROM jobs
          LEFT JOIN shared ON jobs.id = shared.job_id
          LEFT JOIN user ON shared.user_id = user.id
          LEFT JOIN user AS manager ON jobs.manager = manager.id
          LEFT JOIN user AS created ON jobs.createdBy = created.id
          WHERE (jobs.id = ? AND jobs.status != ?) AND (shared.user_id = ? or jobs.createdBy = ?)
          GROUP BY jobs.id`,
        [data.id, STATUS_DB.ELIMINATED, data.userId, data.userId]
      )
    )[0]

    if (!exist)
      throw new HttpException('Job not found', ErrorCodesApi.JOB_NOT_FOUND)

    return exist
  }

  async findAll(userId: number): Promise<Array<DTO.JobResponse>> {
    const aux = 1
    const limit = 10
    const page = aux - 1
    const offset = page * limit
    return await connection.query(
      ` SELECT jobs.id, jobs.title, jobs.description, jobs.status, jobs.submittedAt, jobs.manager,
          IFNULL((SELECT COUNT(comments.comment)
               FROM comments
               WHERE comments.job_id = jobs.id), 0) AS num_comentarios,
          JSON_OBJECT('name', manager.name, 'id', manager.id) as manager
          FROM jobs
          LEFT JOIN shared ON jobs.id = shared.job_id
          LEFT JOIN user ON shared.user_id = user.id
          LEFT JOIN user AS manager ON jobs.manager = manager.id
          WHERE (jobs.status != ? ) AND (shared.user_id = ? OR  jobs.createdBy = ? OR jobs.isPublic = 1)
          GROUP BY jobs.id
          LIMIT ${limit} OFFSET ${offset}`,
      [STATUS_DB.ELIMINATED, userId, userId]
    )
  }
}

export default new JobService()
