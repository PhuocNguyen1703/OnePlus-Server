import { categoryModel } from '~/models/category.model'
import { CategoryType } from '~/schemas/category.schema'
import { ApiResponse } from '~/utils/apiResponse'
import { EntityError } from '~/utils/errors'

const createCategory = async (body: CategoryType) => {
  const existCategory = await categoryModel.findCategory({ slug: body.slug })
  if (existCategory) throw new EntityError([{ field: '', message: 'Category already exists.' }])

  const validatedData = await categoryModel.validateSchema(body)
  if (!validatedData) throw new EntityError([{ field: 'validate model', message: 'Validated data is invalid.' }])

  const newCategory = await categoryModel.insertCategory(validatedData as CategoryType)

  if (!newCategory) throw new Error('Database insert failed')

  return new ApiResponse(true, 'Category created successfully.')
}

const getCategories = async () => {
  const categories = await categoryModel.getCategories()
  return new ApiResponse(true, 'Categories fetched successfully.', categories)
}

export const categoryService = {
  createCategory,
  getCategories,
}
