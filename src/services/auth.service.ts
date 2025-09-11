import { Request } from 'express'
import envConfig from '~/config/envConfig'
import { comparePassword, hashPassword } from '~/utils/crypto'
import { AuthError, EntityError, ForbiddenError, NotfoundError } from '~/utils/errors'
import { generateToken, IPayload } from '~/utils/generateToken'
import crypto from 'crypto'
import { ObjectId } from 'mongodb'
import { redisService } from './redis.service'
import { v4 as uuidv4 } from 'uuid'
import jwt from 'jsonwebtoken'
import { ForgotPasswordType, LoginType, RegisterType } from '~/schemas/auth.schema'
import { ApiResponse } from '~/utils/apiResponse'
import { accountModel } from '~/models/account.model'
import { AccountType } from '~/schemas/account.schema'

const register = async (body: RegisterType) => {
  const { username, password } = body
  const hashedPassword = hashPassword(password)
  const transformData = { ...body, password: hashedPassword, createdAt: new Date() }

  const existUser = await accountModel.findAccount({ username })
  if (existUser) throw new EntityError([{ field: 'username', message: 'Account already exists.' }])
  const validatedData = await accountModel.validateSchema(transformData)

  if (!validatedData) throw new EntityError([{ field: 'validate model', message: 'Validated data is invalid.' }])

  const newUser = await accountModel.insertAccount(validatedData as AccountType)

  if (!newUser) throw new Error('Database insert failed')

  return new ApiResponse(true, 'Account register successfully.')
}

const login = async (body: LoginType) => {
  const { username } = body
  const user = await accountModel.findAccount({ username })

  if (!user || !body.password || !user.password)
    throw new EntityError([{ field: 'username', message: 'Incorrect username or password.' }])

  const validPassword = comparePassword(body.password, user.password)
  if (!validPassword) throw new EntityError([{ field: 'password', message: 'Incorrect username or password.' }])

  if (user._isDeleted) throw new ForbiddenError('Account has been locked.')

  if (user && validPassword) {
    const { _id, role, isActive } = user

    if (!isActive) {
      const code = Math.floor(100000 + Math.random() * 900000).toString()
      const codeExp = Date.now() + 10 * 60 * 1000
      const verification = { code, exp: new Date(codeExp) }

      await accountModel.updateAccount({ _id }, { verification })
      // await sendVerificationEmail(email, verification_code)

      return new ApiResponse(true, 'Account is not verified.', { _id })
    }

    const tokenPayload: IPayload = {
      _id: _id.toString(),
      role
    }

    const accessToken = await generateToken(tokenPayload, envConfig.ACCESS_TOKEN_SECRET_KEY, envConfig.ACCESS_TOKEN_EXP)
    const refreshToken = await generateToken(
      tokenPayload,
      envConfig.REFRESH_TOKEN_SECRET_KEY,
      envConfig.REFRESH_TOKEN_EXP
    )

    // await redisService.setRefreshToken(_id.toString(), refreshToken, 10 * 60 * 1000)
    await accountModel.updateAccount({ _id }, { lastLogin: new Date() })

    delete user.password
    return new ApiResponse(true, 'Login successfully.', { ...user, accessToken, refreshToken })
  }
}

const verifyAccount = async (req: Request) => {
  const { id } = req.params
  const { code } = req.body

  const user = await accountModel.findAccount({
    _id: new ObjectId(id),
    'verification.code': code,
    'verification.exp': { $gt: new Date() }
  })

  if (!user) throw new EntityError([{ field: 'unknown', message: 'Invalid or expired verification code.' }])

  const unsetFields = ['verification']
  const setFields = { isActive: true, updatedAt: new Date() }

  await accountModel.updateAccount({ _id: new ObjectId(id) }, setFields, unsetFields)

  return new ApiResponse(true, 'Account verified successfully.')
}

const forgotPassword = async (body: ForgotPasswordType) => {
  const { username } = body

  const user = await accountModel.findAccount({
    username
  })

  if (!user) throw new NotfoundError('Account not found.')

  if (user._isDeleted) throw new ForbiddenError('Account has been locked.')

  const resetToken = crypto.randomBytes(16).toString('hex')

  // await sendResetPasswordEmail(user.email, resetToken)

  const resetTokenExp = Date.now() + 10 * 60 * 1000
  const reset = { token: resetToken, exp: new Date(resetTokenExp) }

  await accountModel.updateAccount({ username }, { reset })

  return new ApiResponse(true, 'Password reset link sent to your email.')
}

const resetPassword = async (req: Request) => {
  const { token } = req.params
  const { password } = req.body

  const user = await accountModel.findAccount({
    'reset.token': token,
    'reset.exp': { $gt: new Date() }
  })

  if (!user) throw new EntityError([{ field: 'unknown', message: 'Invalid or expired reset token.' }])

  const hashedPassword = hashPassword(password)

  const setFields = { password: hashedPassword, updatedAt: new Date() }
  const unsetFields = ['reset']

  await accountModel.updateAccount({ _id: user._id }, setFields, unsetFields)

  return new ApiResponse(true, 'Password reset successfully.')
}

interface IDecodedToken extends jwt.JwtPayload {
  _id: string
  role: string
}

const refreshToken = async (refreshToken: string) => {
  if (!refreshToken) throw new AuthError('You are not authenticated.')

  const decodedToken = jwt.verify(refreshToken, envConfig.REFRESH_TOKEN_SECRET_KEY) as IDecodedToken

  const tokenPayload: IPayload = {
    _id: decodedToken._id,
    role: decodedToken.role
  }

  const newAccessToken = await generateToken(
    tokenPayload,
    envConfig.ACCESS_TOKEN_SECRET_KEY,
    envConfig.ACCESS_TOKEN_EXP
  )
  const newRefreshToken = await generateToken(
    tokenPayload,
    envConfig.REFRESH_TOKEN_SECRET_KEY,
    envConfig.REFRESH_TOKEN_EXP
  )

  return new ApiResponse(true, 'Refresh token successfully.', { newAccessToken, newRefreshToken })
}

const logout = async (req: Request) => {
  const userId = req?.userId as string
  const refreshTokenFromCookie = req.headers?.cookie as string

  const refreshTokenFromRedis = await redisService.getRefreshToken(userId)
  console.log('redis:::::', refreshTokenFromRedis)
  console.log('cookie:::::', req.headers.cookie)

  if (refreshTokenFromCookie != refreshTokenFromRedis)
    throw new ForbiddenError('You are not authorized to perform this action.')

  await redisService.deleteRefreshToken(userId)

  return new ApiResponse(true, 'Logged out successfully.')
}

export const authService = { register, login, verifyAccount, forgotPassword, resetPassword, refreshToken, logout }
