import { config } from 'dotenv'
import fs from 'fs'
import path from 'path'
import z from 'zod'

config({
  path: '.env',
})

const checkEnvFile = async () => {
  if (!fs.existsSync(path.resolve('.env'))) {
    console.log('Env file not found!!!!')
    process.exit(1)
  }
}
checkEnvFile()

const configSchema = z.object({
  NODE_ENV: z.string(),
  PORT: z.coerce.number().default(5000),
  CLIENT_URL: z.string(),
  MONGO_DB: z.string(),
  REDIS_PW: z.string(),
  ACCESS_TOKEN_SECRET_KEY: z.string(),
  REFRESH_TOKEN_SECRET_KEY: z.string(),
  ACCESS_TOKEN_EXP: z.string(),
  REFRESH_TOKEN_EXP: z.string(),
  RESEND_API_KEY: z.string(),
  LOGO_URL: z.string(),
})

const configServer = configSchema.safeParse(process.env)

if (!configServer.success) {
  console.error(configServer.error.issues)
  throw new Error('The values ​​declared in the .env file are invalid')
}

const envConfig = configServer.data
export default envConfig
