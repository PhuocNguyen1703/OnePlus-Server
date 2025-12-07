import { ZodError } from 'zod'
import { AccountSchema, AccountType } from '~/schemas/account.schema'
import { RegisterType } from '~/schemas/auth.schema'
import { findOne, insertOne, updateDocumentFields } from '~/utils/db.helpers'

const COLLECTION: string = 'accounts'

const validateSchema = (data: RegisterType) => {
  try {
    return AccountSchema.parse(data)
  } catch (error) {
    throw error as ZodError
  }
}

const findAccount = async (filter: Record<string, unknown>) => {
  return findOne<AccountType>(COLLECTION, filter)
}

const insertAccount = async (data: AccountType) => {
  return insertOne<AccountType>(COLLECTION, data)
}

const updateAccount = async (
  filterQuery: Partial<AccountType>,
  setFields?: Partial<AccountType>,
  unsetFields?: string[],
) => {
  return updateDocumentFields<AccountType>(COLLECTION, filterQuery, setFields, unsetFields)
}

export const accountModel = { validateSchema, findAccount, insertAccount, updateAccount }
