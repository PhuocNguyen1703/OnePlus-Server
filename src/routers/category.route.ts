import express from 'express'
import { categoryController } from '~/controllers/category.controller'
import { validateData } from '~/middlewares/validation'
import { CategorySchema } from '~/schemas/category.schema'

const router = express.Router()

router.post('/', validateData(CategorySchema), categoryController.createCategory)
router.get('/', categoryController.getCategories)

export default router
