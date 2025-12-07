import { dishModel } from '~/models/dish.model'
import { DishType } from '~/schemas/dish.schema'
import { ApiResponse } from '~/utils/apiResponse'
import { ConflictError, InternalServerError } from '~/utils/errors'

const createDish = async (body: DishType) => {
  const existingDish = await dishModel.findDish({ sku: body.sku })
  if (existingDish) throw new ConflictError('Dish already exists.')

  const validatedData = dishModel.validateSchema(body)

  const insertResult = await dishModel.insertDish(validatedData as DishType)

  if (!insertResult.acknowledged || !insertResult.insertedId) throw new InternalServerError('Database insert failed')

  return new ApiResponse(true, 'Dish created successfully.')
}

const getDishes = async () => {
  const dishes = await dishModel.getAllDishes()
  return new ApiResponse(true, 'Dishes fetched successfully.', dishes)
}

export const dishService = {
  createDish,
  getDishes,
}
