import { tableModel } from '~/models/table.model'
import { TableType } from '~/schemas/table.schema'
import { ApiResponse } from '~/utils/apiResponse'
import { ConflictError, InternalServerError } from '~/utils/errors'

const createTable = async (body: TableType) => {
  const existingTable = await tableModel.findTable({ name: body.name })
  if (existingTable) throw new ConflictError('Table already exists.')

  const validatedData = tableModel.validateSchema(body)

  const insertResult = await tableModel.insertTable(validatedData as TableType)

  if (!insertResult.acknowledged || !insertResult.insertedId) throw new InternalServerError('Database insert failed')

  return new ApiResponse(true, 'Table created successfully.')
}

const getTables = async () => {
  const tables = await tableModel.getAllTables()
  return new ApiResponse(true, 'Tables fetched successfully.', tables)
}

export const tableService = {
  createTable,
  getTables,
}
