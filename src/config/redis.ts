import { createClient, RedisClientType } from 'redis'
import envConfig from './envConfig'

const redisClient: RedisClientType = createClient({
  username: 'default',
  password: envConfig.REDIS_PW,
  socket: {
    host: 'redis-19203.c295.ap-southeast-1-1.ec2.cloud.redislabs.com',
    port: 19203,
  },
})

redisClient.on('error', (err: Error) => console.log('Connect fail to Redis.', err))
export const connectRedisClient = async (): Promise<void> => {
  try {
    await redisClient.connect()
    console.log('Connected successfully to Redis')
  } catch (err) {
    console.log('Connect fail to Redis.', err)
    process.exit(1)
  }
}

export default redisClient
