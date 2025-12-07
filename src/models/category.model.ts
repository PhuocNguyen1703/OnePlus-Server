import { ZodError } from 'zod'
import { CategorySchema, CategoryType } from '~/schemas/category.schema'
import { findAll, findOne, insertOne } from '~/utils/db.helpers'

const COLLECTION: string = 'categories'

const validateSchema = (data: CategoryType) => {
  try {
    return CategorySchema.parse(data)
  } catch (error) {
    throw error as ZodError
  }
}

const findCategory = async (query: Partial<CategoryType>) => {
  return findOne<CategoryType>(COLLECTION, query)
}

const getAllCategories = async () => {
  return findAll(COLLECTION)
}

const insertCategory = async (data: CategoryType) => {
  return insertOne<CategoryType>(COLLECTION, data)
}

export const categoryModel = { validateSchema, findCategory, getAllCategories, insertCategory }
