import { Db, MongoClient } from 'mongodb'
import envConfig from './envConfig'

let dbInstance: Db
const DB_NAME = 'OnePlus_DB'

const client = new MongoClient(envConfig.MONGO_DB)

export const connectDB = async () => {
  await client.connect()
  dbInstance = client.db(DB_NAME)
}

export const getDB = (): Db => {
  if (!dbInstance) throw new Error('Must connect to database first')
  return dbInstance
}
