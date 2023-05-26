import { DTO } from '../common'
import { JobsTable } from './jobs.table'
import { UserTable } from './user.table'

export const SharedTable: DTO.GeneralTable = {
  nameTable: 'shared',
  columns: [
    {
      name: 'id',
      type: 'INT',
      isAutoIncrement: true,
      isPrimaryKey: true,
      isRequired: true,
    },
    {
      name: 'job_id',
      type: 'INT',
      isRequired: true,
      foreignKey: {
        columnName: 'job_id',
        referencedTable: JobsTable.nameTable,
        referencedColumnName: 'id',
      },
    },
    {
      name: 'user_id',
      type: 'INT',
      isRequired: true,
      foreignKey: {
        columnName: 'user_id',
        referencedTable: UserTable.nameTable,
        referencedColumnName: 'id',
      },
    },
  ],
}
