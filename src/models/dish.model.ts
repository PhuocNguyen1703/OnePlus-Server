import { ZodError } from 'zod'
import { DishSchema, DishType } from '~/schemas/dish.schema'
import { findAll, findOne, insertOne } from '~/utils/db.helpers'

const COLLECTION: string = 'dishes'

const validateSchema = (data: DishType) => {
  try {
    return DishSchema.parse(data)
  } catch (error) {
    throw error as ZodError
  }
}

const findDish = async (query: Partial<DishType>) => {
  return findOne<DishType>(COLLECTION, query)
}

const getAllDishes = async () => {
  return findAll(COLLECTION)
}

const insertDish = async (data: DishType) => {
  return insertOne<DishType>(COLLECTION, data)
}

export const dishModel = { validateSchema, findDish, getAllDishes, insertDish }
