import { DTO } from '../common'
import connection from './connection'
import { logger } from '../logger/logger'
export class CreateTableGeneral {
  private configTable: DTO.GeneralTable

  async loadTable(data: DTO.GeneralTable): Promise<void> {
    this.configTable = data
    await this.createTable()
  }

  private async createTable(): Promise<void> {
    const existTable = await connection.query<string, []>(
      'SELECT TABLE_NAME FROM information_schema.tables WHERE TABLE_NAME = ?',
      [this.configTable.nameTable]
    )

    if (existTable.length) {
      logger.debug(`Table already exists: ${this.configTable.nameTable}`)
    } else {
      let sql = `CREATE TABLE IF NOT EXISTS ${this.configTable.nameTable} (`
      for (const column of this.configTable.columns) {
        const { name, type } = column
        sql += `${name}  ${type}`

        sql += this.createSql(column)
      }

      sql = sql.slice(0, -2)
      sql += ')'

      await connection.query(sql)
      logger.debug(`Create table: ${this.configTable.nameTable}`)
    }
  }

  private createSql(columns: {
    name: string
    type: string

    isRequired?: boolean
    isAutoIncrement?: boolean
    isPrimaryKey?: boolean
    foreignKey?: {
      columnName: string
      referencedTable: string
      referencedColumnName?: string
    }
  }) {
    let sql = ''
    if (columns.isRequired) sql += ' NOT NULL'
    else sql += ' NULL'
    if (columns.isAutoIncrement) {
      sql += ' AUTO_INCREMENT'
    }

    if (columns.isPrimaryKey) {
      sql += ' PRIMARY KEY'
    }

    if (columns.foreignKey) {
      console.log('FK >> ', columns.foreignKey)
      const { columnName, referencedTable, referencedColumnName } =
        columns.foreignKey
      sql += `, FOREIGN KEY (${columnName}) REFERENCES ${referencedTable}(${referencedColumnName})`
    }

    sql += ', '

    return sql
  }
}
