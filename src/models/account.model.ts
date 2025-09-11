import { ZodError } from 'zod'
import { accountSchema, AccountType } from '~/schemas/account.schema'
import { RegisterType } from '~/schemas/auth.schema'
import { findOne, insertOne, updateDocumentFields } from '~/utils/db.helpers'

const ACCOUNT_COLLECTION: string = 'accounts'

const validateSchema = async (data: RegisterType) => {
  console.log('valid')

  try {
    return accountSchema.parse(data)
  } catch (error) {
    throw error as ZodError
  }
}

const findAccount = async (filter: Record<string, unknown>) => {
  return findOne<AccountType>(ACCOUNT_COLLECTION, filter)
}

const insertAccount = async (data: AccountType) => {
  return insertOne<AccountType>(ACCOUNT_COLLECTION, data)
}

const updateAccount = async (
  filterQuery: Partial<AccountType>,
  setFields?: Partial<AccountType>,
  unsetFields?: string[]
) => {
  return updateDocumentFields<AccountType>(ACCOUNT_COLLECTION, filterQuery, setFields, unsetFields)
}

export const accountModel = { validateSchema, findAccount, insertAccount, updateAccount }
