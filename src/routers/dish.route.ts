import express from 'express'
import { dishController } from '~/controllers/dish.controller'
import { validateData } from '~/middlewares/validation'
import { DishSchema } from '~/schemas/dish.schema'

const router = express.Router()

router.post('/', validateData(DishSchema), dishController.createDish)
router.get('/', dishController.getDishes)

export default router
