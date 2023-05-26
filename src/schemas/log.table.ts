import { DTO } from '../common'

export const LogTable: DTO.GeneralTable = {
  nameTable: 'log',
  columns: [
    {
      name: 'id',
      type: 'INT',
      isAutoIncrement: true,
      isPrimaryKey: true,
      isRequired: true,
    },
    {
      name: 'finishedAt',
      type: 'DATETIME',
    },
    { name: 'action', type: 'VARCHAR(255)', isRequired: true },
    { name: 'description', type: 'TEXT', isRequired: true },
    { name: 'error', type: 'TEXT' },
    { name: 'code', type: 'INT' },
    { name: 'userId', type: 'INT' },
  ],
}
