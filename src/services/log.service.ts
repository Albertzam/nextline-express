import { DTO } from '../common'

import connection from '../db/connection'
class LogService {
  async createLog(data: DTO.Log): Promise<void> {
    await connection.query(
      'INSERT INTO log (finishedAt,action, description, userId, code, error) VALUES (?,?,?,?,?,?)',
      [
        data.finishedAt,
        data.action,
        data.description,
        data.userId,
        data.code,
        data.error,
      ]
    )
  }
}

export default new LogService()
