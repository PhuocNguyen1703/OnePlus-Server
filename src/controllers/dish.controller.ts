import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { asyncHandler } from '~/middlewares/asyncHandler'
import { dishService } from '~/services/dish.service'

const createDish = asyncHandler(async (req: Request, res: Response) => {
  const result = await dishService.createDish(req.body)
  res.status(StatusCodes.CREATED).json(result)
})

const getDishes = asyncHandler(async (req: Request, res: Response) => {
  const result = await dishService.getDishes()
  res.status(StatusCodes.OK).json(result)
})

export const dishController = {
  createDish,
  getDishes,
}
