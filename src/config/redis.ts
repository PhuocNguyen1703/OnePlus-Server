import { createClient, RedisClientType } from 'redis'
import envConfig from './envConfig'

const redisClient: RedisClientType = createClient({
  username: 'default',
  password: envConfig.REDIS_PW,
  socket: {
    host: 'redis-10178.c1.ap-southeast-1-1.ec2.redns.redis-cloud.com',
    port: 10178
  }
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
