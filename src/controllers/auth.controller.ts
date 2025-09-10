import { Request, Response } from 'express'
import { authService } from '../services/auth.service'
import { StatusCodes } from 'http-status-codes'
import { asyncHandler } from '~/middlewares/asyncHandler'

const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.register(req.body)
  res.status(StatusCodes.CREATED).json(result)
})

const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.login(req.body)
  res.status(StatusCodes.OK).json(result)
})

const verifyAccount = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.verifyAccount(req)
  res.status(StatusCodes.OK).json(result)
})

const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.forgotPassword(req.body)
  res.status(StatusCodes.OK).json(result)
})

const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.resetPassword(req)
  res.status(StatusCodes.OK).json(result)
})

const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.headers?.cookie as string
  const result = await authService.refreshToken(refreshToken)
  res.status(StatusCodes.OK).json(result)
})

const logout = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.logout(req)
  res.status(StatusCodes.OK).json(result)
})

export const authController = { register, login, verifyAccount, forgotPassword, resetPassword, refreshToken, logout }
