import { DTO } from '../common'

export const JobsTable: DTO.GeneralTable = {
  nameTable: 'jobs',
  columns: [
    {
      name: 'id',
      type: 'INT',
      isAutoIncrement: true,
      isPrimaryKey: true,
      isRequired: true,
    },
    { name: 'title', type: 'VARCHAR(50)', isRequired: true },
    { name: 'description', type: 'VARCHAR(255)', isRequired: true },
    {
      name: 'status',
      type: 'VARCHAR(20)',
      isRequired: true,
    },
    {
      name: 'submittedAt',
      type: 'DATETIME',
      isRequired: true,
    },
    { name: 'isPublic', type: 'TINYINT', isRequired: true },
    { name: 'createdBy', type: 'INT', isRequired: true },
    { name: 'manager', type: 'INT', isRequired: false },
    { name: 'tags', type: 'VARCHAR(12)', isRequired: false },
  ],
}
