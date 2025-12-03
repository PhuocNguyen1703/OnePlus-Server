import { getDB } from '~/config/mongodb'

export const findOne = async <T>(collection: string, filter: Partial<T>, option?: { [key: string]: unknown }) => {
  return getDB().collection(collection).findOne(filter, option)
}

export const findAll = async (collection: string, option?: { [key: string]: unknown }) => {
  return getDB().collection(collection).find({}, option).toArray()
}

export const insertOne = async <T>(collection: string, data: Partial<T>, option?: { [key: string]: unknown }) => {
  return getDB().collection(collection).insertOne(data, option)
}

export const updateDocumentFields = async <T>(
  collection: string,
  filterQuery: Partial<T>,
  setFields?: Partial<T>,
  unsetFields: string[] = [],
) => {
  const updateOperations: Record<string, unknown> = {}

  if (setFields && Object.keys(setFields).length > 0) {
    updateOperations.$set = setFields
  }

  if (unsetFields && unsetFields.length > 0) {
    updateOperations.$unset = unsetFields.reduce<Record<string, ''>>((acc, field) => ({ ...acc, [field]: '' }), {})
  }

  if (Object.keys(updateOperations).length === 0) return null

  return getDB().collection(collection).updateMany(filterQuery, updateOperations)
}
