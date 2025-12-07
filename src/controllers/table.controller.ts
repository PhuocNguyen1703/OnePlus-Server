import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { asyncHandler } from '~/middlewares/asyncHandler'
import { tableService } from '~/services/table.service'

const createTable = asyncHandler(async (req: Request, res: Response) => {
  const result = await tableService.createTable(req.body)
  res.status(StatusCodes.CREATED).json(result)
})

const getTables = asyncHandler(async (req: Request, res: Response) => {
  const result = await tableService.getTables()
  res.status(StatusCodes.OK).json(result)
})

export const tableController = {
  createTable,
  getTables,
}
