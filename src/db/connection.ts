import { createConnection, Connection } from 'mysql2/promise'
import { logger } from '../logger/logger'

export class ConnectionDb {
  private connection: Connection
  private static instance: ConnectionDb

  async connect(): Promise<void> {
    try {
      this.connection = await createConnection({
        host: process.env.HOST_MYSQL,
        user: process.env.USER_MYSQL,
        password: process.env.PASSWORD_MYSQL,
        database: process.env.DATABASE_MYSQL,
      })
    } catch (err) {
      logger.error(`Error connecting to database ${err}`)
      process.exit(1)
    }
  }
  async query<T, K>(sql: string, values?: Array<T>): Promise<Array<K>> {
    if (!this.connection) {
      throw new Error('Connection to database is failed')
    }

    const [rows] = await this.connection.execute(sql, values)

    return !Array.isArray(rows) ? ([rows] as K[]) : (rows as K[])
  }

  async close(): Promise<void> {
    if (this.connection) {
      await this.connection.end()
    }
  }
  disconnect(): void {
    if (this.connection) {
      this.connection.end()
      logger.info('Database disconnect')
    }
  }

  getConnection() {
    if (!ConnectionDb.instance) {
      ConnectionDb.instance = new ConnectionDb()
    }
    return ConnectionDb.instance
  }
}

const db = new ConnectionDb()

export default db
