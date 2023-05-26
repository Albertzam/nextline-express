/* eslint-disable @typescript-eslint/no-explicit-any */
import { DTO } from '../common'

import connection from '../db/connection'

class AdminService {
  private getFilter(data: DTO.SearchByQuery): {
    sql: string
    values: Array<string | Date | boolean>
  } {
    let sql = ''
    const values: Array<any> = []
    for (const key of Object.keys(data)) {
      switch (key) {
        case 'word':
          sql += ` jobs.title LIKE ? AND`
          values.push(`%${data.word}%`)
          break
        case 'isPublic':
          console.log('IS PUBLIC >> ', data.isPublic)
          sql += ' jobs.isPublic = ? AND'
          values.push(data.isPublic)
          break
        case 'status':
          sql += ' jobs.status = ? AND'
          values.push(data.status)
          break
        case 'date':
          sql += ' jobs.submittedAt <= ? AND'
          values.push(data.date)
          break
      }
    }

    return { sql, values }
  }
  async searchByWord(data: DTO.SearchByQuery): Promise<any> {
    const createSql = this.getFilter(data)
    createSql.sql = createSql.sql.slice(0, -4)
    const page = data.page - 1
    const offset = page * data.limit

    return await connection.query(
      `SELECT jobs.id, jobs.title, jobs.description, jobs.status, jobs.isPublic, jobs.status, jobs.submittedAt,
      jobs.manager,
      JSON_OBJECT('name', manager.name, 'email', manager.email, 'id', manager.id) as manager,
      JSON_OBJECT('name', created.name, 'email', created.email, 'id', created.id) as createdBy
      FROM jobs
      LEFT JOIN shared ON jobs.id = shared.job_id
      LEFT JOIN user AS manager ON jobs.manager = manager.id
      LEFT JOIN user AS created ON jobs.createdBy = created.id
       ${createSql.values.length ? `WHERE ${createSql.sql}` : ''}
       GROUP BY jobs.id
       LIMIT ${data.limit} OFFSET ${offset}
       `,
      createSql.values.length ? createSql.values : []
    )
  }
}

export default new AdminService()
