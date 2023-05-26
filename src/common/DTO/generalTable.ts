export class GeneralTable<T = any> {
  nameTable: string
  columns: Array<{
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
  }>
}
