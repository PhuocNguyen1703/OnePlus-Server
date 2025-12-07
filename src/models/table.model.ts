import { ZodError } from 'zod'
import { TableSchema, TableType } from '~/schemas/table.schema'
import { findAll, findOne, insertOne } from '~/utils/db.helpers'

const COLLECTION: string = 'tables'

const validateSchema = (data: TableType) => {
  try {
    return TableSchema.parse(data)
  } catch (error) {
    throw error as ZodError
  }
}

const findTable = async (query: Partial<TableType>) => {
  return findOne<TableType>(COLLECTION, query)
}

const getAllTables = async () => {
  return findAll(COLLECTION)
}

const insertTable = async (data: TableType) => {
  return insertOne<TableType>(COLLECTION, data)
}

export const tableModel = { validateSchema, findTable, getAllTables, insertTable }
