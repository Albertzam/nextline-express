import { DTO } from '../common'

export const UserTable: DTO.GeneralTable = {
  nameTable: 'user',
  columns: [
    {
      name: 'id',
      type: 'INT',
      isAutoIncrement: true,
      isPrimaryKey: true,
      isRequired: true,
    },
    { name: 'name', type: 'VARCHAR(50)', isRequired: true },
    { name: 'password', type: 'VARCHAR(255)', isRequired: true },
    { name: 'email', type: 'VARCHAR(80)', isRequired: true },
  ],
}
