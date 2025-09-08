import { Request } from 'express'
import envConfig from '~/config/envConfig'
import { authModel } from '~/models/auth.model'
import { comparePassword, hashPassword } from '~/utils/crypto'
import { AuthError, EntityError, ForbiddenError, NotfoundError } from '~/utils/errors'
import { generateToken, IPayload } from '~/utils/generateToken'
import crypto from 'crypto'
import { ObjectId } from 'mongodb'
import { redisService } from './redis.service'
import { v4 as uuidv4 } from 'uuid'
import jwt from 'jsonwebtoken'
import { client } from '~/config/mongodb'
import { ZodObject, ZodRawShape } from 'zod'
import { ForgotPasswordType, LoginType, RegisterType } from '~/schemas/auth.schema'
import { staffSchema, studentSchema, teacherSchema } from '~/schemas/profile.schema'

export const USER_COLLECTION: string = 'users'
const PROFILE_COLLECTION: string = 'profiles'

const register = async (body: RegisterType) => {
  const { userName, password, role } = body
  const hashedPassword = hashPassword(password)
  const transformData = { ...body, password: hashedPassword, createdAt: new Date() }

  const session = client.startSession()
  try {
    session.startTransaction()

    const existUser = await authModel.findOne({ userName }, USER_COLLECTION)
    if (existUser) throw new EntityError([{ field: 'userName', message: 'User already exists.' }])

    const validatedData = await authModel.validateSchema(transformData)
    if (!validatedData) throw new EntityError([{ field: 'validate model', message: 'Validated data is invalid.' }])

    const newUser = await authModel.insertOne(validatedData, USER_COLLECTION, { session })

    if (!newUser) throw new Error('Failed to create new user.')

    const newUserId: ObjectId = newUser.insertedId

    const roleSchemaMap: Record<string, ZodObject<ZodRawShape>> = {
      student: studentSchema,
      teacher: teacherSchema
    }
    const specificSchema: ZodObject<ZodRawShape> = roleSchemaMap[role] || staffSchema
    const specificDoc = specificSchema.parse({ userId: newUserId.toString(), createdAt: validatedData.createdAt })

    await authModel.insertOne(specificDoc, PROFILE_COLLECTION, { session })
    const createdUser = await authModel.findOne({ _id: newUserId }, USER_COLLECTION, { session })

    if (!createdUser) throw new Error('Failed to retrieve new user after registration.')

    await session.commitTransaction()
    return { message: `User ${createdUser?.userName} register successfully.` }
  } catch (error) {
    await session.abortTransaction()
    throw error as Error
  } finally {
    session.endSession()
  }
}

const login = async (body: LoginType) => {
  const { userName } = body

  try {
    const user = await authModel.findOne({ userName }, USER_COLLECTION)

    if (!user || !body.password || !user.password)
      throw new EntityError([{ field: 'unknown', message: 'Incorrect email or password.' }])

    const validPassword = comparePassword(body.password, user.password)
    if (!validPassword) throw new EntityError([{ field: 'password', message: 'Incorrect email or password.' }])

    if (user._isDeleted) throw new ForbiddenError('Account has been locked.')

    if (user && validPassword) {
      const { _id, role, isActive } = user

      if (!isActive) {
        const code = Math.floor(100000 + Math.random() * 900000).toString()
        const codeExp = Date.now() + 10 * 60 * 1000
        const verification = { code, exp: new Date(codeExp) }

        await authModel.updateDocumentFields({ _id }, { verification })
        // await sendVerificationEmail(email, verification_code)

        return { data: { _id }, message: 'Account is not verified.' }
      }

      const tokenPayload: IPayload = {
        _id: _id.toString(),
        role
      }

      const accessToken = await generateToken(
        tokenPayload,
        envConfig.ACCESS_TOKEN_SECRET_KEY,
        envConfig.ACCESS_TOKEN_EXP
      )
      const refreshToken = await generateToken(
        tokenPayload,
        envConfig.REFRESH_TOKEN_SECRET_KEY,
        envConfig.REFRESH_TOKEN_EXP
      )

      const tokens = {
        accessToken,
        refreshToken
      }

      // await redisService.setRefreshToken(_id.toString(), refreshToken, 10 * 60 * 1000)

      return { data: { _id, tokens }, message: 'Login successfully.' }
    }
  } catch (error) {
    throw error as Error
  }
}

const verifyEmail = async (req: Request) => {
  const { id } = req.params
  const { code } = req.body

  try {
    const user = await authModel.findOne(
      {
        _id: new ObjectId(id),
        verification: {
          code,
          exp: { $gt: new Date() }
        }
      },
      USER_COLLECTION
    )

    if (!user) throw new EntityError([{ field: 'unknown', message: 'Invalid or expired verification code.' }])

    const unsetFields = ['verification_code', 'verification_code_exp']
    const setFields = { isActive: true, updatedAt: new Date() }

    await authModel.updateDocumentFields({ _id: new ObjectId(id) }, setFields, unsetFields)

    return { message: 'Email verified successfully' }
  } catch (error) {
    throw error as Error
  }
}

const forgotPassword = async (body: ForgotPasswordType) => {
  const { userName } = body

  try {
    const user = await authModel.findOne(
      {
        userName
      },
      USER_COLLECTION
    )

    if (!user) throw new NotfoundError('Email not found.')

    if (user._isDeleted) throw new ForbiddenError('Account has been locked.')

    const resetToken = crypto.randomBytes(16).toString('hex')

    // await sendResetPasswordEmail(user.email, resetToken)

    const resetTokenExp = Date.now() + 10 * 60 * 1000
    const setFields = { resetToken, resetTokenExp }

    // await authModel.updateDocumentFields({ userName }, setFields)

    return { message: 'Password reset link sent to your email.' }
  } catch (error) {
    throw error as Error
  }
}

const resetPassword = async (req: Request) => {
  const { token } = req.params
  const { password } = req.body

  try {
    const user = await authModel.findOne(
      {
        reset_password_token: token,
        reset_password_token_exp: { $gt: Date.now() }
      },
      USER_COLLECTION
    )

    if (!user) throw new EntityError([{ field: 'unknown', message: 'Invalid or expired reset token.' }])

    const hashedPassword = hashPassword(password)

    const setFields = { password: hashedPassword, updatedAt: Date.now() }
    const unsetFields = ['reset_password_token', 'reset_password_token_exp']

    // await authModel.updateDocumentFields({ _id: user?._id }, setFields, unsetFields)

    return { message: 'Password reset successfully.' }
  } catch (error) {
    throw error as Error
  }
}

interface IDecodedToken extends jwt.JwtPayload {
  _id: string
  role: string
}

const refreshToken = async (refreshToken: string) => {
  if (!refreshToken) throw new AuthError('You are not authenticated.')

  try {
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

    return { data: { newAccessToken, newRefreshToken }, message: 'Refresh token successfully.' }
  } catch (error) {
    throw error as Error
  }
}

const logout = async (req: Request) => {
  const userId = req?.userId as string
  const refreshTokenFromCookie = req.headers?.cookie as string

  try {
    const refreshTokenFromRedis = await redisService.getRefreshToken(userId)
    console.log('redis:::::', refreshTokenFromRedis)
    console.log('cookie:::::', req.headers.cookie)

    if (refreshTokenFromCookie != refreshTokenFromRedis)
      throw new ForbiddenError('You are not authorized to perform this action.')

    await redisService.deleteRefreshToken(userId)

    return { message: 'Logged out successfully.' }
  } catch (error) {
    throw error as Error
  }
}

export const authService = { register, login, verifyEmail, forgotPassword, resetPassword, refreshToken, logout }
