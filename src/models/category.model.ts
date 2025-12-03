import { ZodError } from 'zod'
import { CategorySchema, CategoryType } from '~/schemas/category.schema'
import { findAll, findOne, insertOne } from '~/utils/db.helpers'

const CATEGORY_COLLECTION: string = 'categories'

const validateSchema = async (data: CategoryType) => {
  try {
    return CategorySchema.parse(data)
  } catch (error) {
    throw error as ZodError
  }
}

const findCategory = async (query: Partial<CategoryType>) => {
  return findOne<CategoryType>(CATEGORY_COLLECTION, query)
}

const getCategories = async () => {
  return findAll(CATEGORY_COLLECTION)
}

const insertCategory = async (data: CategoryType) => {
  return insertOne<CategoryType>(CATEGORY_COLLECTION, data)
}

export const categoryModel = { validateSchema, findCategory, getCategories, insertCategory }
