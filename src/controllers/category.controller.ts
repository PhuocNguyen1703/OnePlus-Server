import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { asyncHandler } from '~/middlewares/asyncHandler'
import { categoryService } from '~/services/category.service'

const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const result = await categoryService.createCategory(req.body)
  res.status(StatusCodes.CREATED).json(result)
})

const getCategories = asyncHandler(async (req: Request, res: Response) => {
  const result = await categoryService.getCategories()
  res.status(StatusCodes.OK).json(result)
})

export const categoryController = {
  createCategory,
  getCategories,
}
