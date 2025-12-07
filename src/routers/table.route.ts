import express from 'express'
import { tableController } from '~/controllers/table.controller'
import { validateData } from '~/middlewares/validation'
import { TableSchema } from '~/schemas/table.schema'

const router = express.Router()

router.post('/', validateData(TableSchema), tableController.createTable)
router.get('/', tableController.getTables)

export default router
