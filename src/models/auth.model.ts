import { ZodError } from 'zod'
import { getDB } from '~/config/mongodb'
import { userSchema, UserType } from '~/schemas/account.schema'
import { RegisterType } from '~/schemas/auth.schema'
import { USER_COLLECTION } from '~/services/auth.service'

const validateSchema = async (data: RegisterType) => {
  try {
    return userSchema.parse(data)
  } catch (error) {
    throw error as ZodError
  }
}

const findOne = async (
  filter: { [key: string]: unknown },
  collectionName: string,
  option?: { [key: string]: unknown }
) => {
  try {
    const result = await getDB().collection(collectionName).findOne(filter, option)

    return result
  } catch (error) {
    throw error as Error
  }
}

const insertOne = async (
  registerData: Partial<UserType>,
  collectionName: string,
  option?: { [key: string]: unknown }
) => {
  try {
    const result = await getDB().collection(collectionName).insertOne(registerData, option)

    return result
  } catch (error) {
    throw error as Error
  }
}

const updateDocumentFields = async (
  filterQuery: Partial<UserType>,
  setFields?: Partial<UserType>,
  unsetFields?: string[]
) => {
  const updateOperations: { [key: string]: Partial<UserType> | string[] } = {}

  if (setFields && Object.keys(setFields).length > 0) {
    updateOperations.$set = setFields
  }

  if (unsetFields && unsetFields.length > 0) {
    const unsetObj: { [key: string]: '' } = {}

    for (const field of unsetFields) {
      unsetObj[field] = ''
    }

    updateOperations.$unset = unsetObj
  }

  if (Object.keys(updateOperations).length === 0) return null

  try {
    const result = await getDB().collection(USER_COLLECTION).updateMany(filterQuery, updateOperations)

    return result
  } catch (error) {
    throw error as Error
  }
}

export const authModel = { validateSchema, findOne, insertOne, updateDocumentFields }
