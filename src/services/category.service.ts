import { categoryModel } from '~/models/category.model'
import { CategoryType } from '~/schemas/category.schema'
import { ApiResponse } from '~/utils/apiResponse'
import { ConflictError, InternalServerError } from '~/utils/errors'

const createCategory = async (body: CategoryType) => {
  const existingCategory = await categoryModel.findCategory({ slug: body.slug })
  if (existingCategory) throw new ConflictError('Category already exists.')

  const validatedData = categoryModel.validateSchema(body)

  const insertResult = await categoryModel.insertCategory(validatedData as CategoryType)

  if (!insertResult.acknowledged || !insertResult.insertedId) throw new InternalServerError('Database insert failed')

  return new ApiResponse(true, 'Category created successfully.')
}

const getCategories = async () => {
  const categories = await categoryModel.getAllCategories()
  return new ApiResponse(true, 'Categories fetched successfully.', categories)
}

export const categoryService = {
  createCategory,
  getCategories,
}
