import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'
import envConfig from '~/config/envConfig'

const verifyTokenAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token: string = (req.headers?.authorization as string)?.split('Bearer ')[1]

    const decodedToken = jwt.verify(token, envConfig.ACCESS_TOKEN_SECRET_KEY)

    if (decodedToken && typeof decodedToken === 'object') {
      req.userId = decodedToken._id as string
      next()
    }
  } catch (error) {
    res.status(StatusCodes.UNAUTHORIZED).json({ error, message: 'You are not authenticated' })
  }
}

const verifyTokenCookie = (req: Request, res: Response, next: NextFunction) => {
  console.log('server')

  try {
    const token = req.headers?.cookie as string
    console.log(token)
    console.log('reqqqqq', req.cookies)

    const decodedToken = jwt.verify(token, envConfig.REFRESH_TOKEN_SECRET_KEY)

    if (decodedToken && typeof decodedToken === 'object') {
      req.userId = decodedToken._id as string
      next()
    }
  } catch (error) {
    res.status(StatusCodes.UNAUTHORIZED).json({ error, message: 'You are not authenticated' })
  }
}

const verifyTokenUSerAuthorization = (req: Request, res: Response, next: NextFunction) => {}

const verifyTokenAdmin = (req: Request, res: Response, next: NextFunction) => {}

export const authMiddleware = { verifyTokenAuth, verifyTokenCookie, verifyTokenUSerAuthorization, verifyTokenAdmin }
