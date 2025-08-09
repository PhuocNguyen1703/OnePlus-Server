import redisClient from '~/config/redis'

interface IRedisService {
  setRefreshToken(userId: string, refreshToken: string, expiresIn: number): Promise<boolean>
  getRefreshToken(userId: string): Promise<string | null>
  deleteRefreshToken(userId: string): Promise<boolean>
  disconnect(): Promise<void>
}
export const redisService: IRedisService = {
  setRefreshToken: async (userId: string, refreshToken: string, expiresIn: number) => {
    try {
      await redisClient.set(userId, refreshToken, {
        EX: expiresIn
      })
      return true
    } catch (error) {
      console.log('Error setting refresh token in Redis', error)
      return false
    }
  },
  getRefreshToken: async (userId: string): Promise<string | null> => {
    try {
      return await redisClient.get(userId)
    } catch (error) {
      console.log('Error getting refresh token from Redis', error)
      return null
    }
  },

  deleteRefreshToken: async (userId: string): Promise<boolean> => {
    try {
      await redisClient.del(userId)
      return true
    } catch (error) {
      console.log('Error deleting refresh token from Redis', error)
      return false
    }
  },

  disconnect: async (): Promise<void> => {
    try {
      await redisClient.quit()
    } catch (error) {
      console.log('Error disconnecting from Redis', error)
    }
  }
}
