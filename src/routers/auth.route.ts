import express from 'express'
import { authController } from '~/controllers/auth.controller'
import { validateData } from '~/middlewares/validation'
import { authMiddleware } from '~/middlewares/verifyToken'
import {
  ForgotPasswordSchema,
  LoginSchema,
  OTPSchema,
  RegisterSchema,
  ResetPasswordSchema,
} from '~/schemas/auth.schema'

const router = express.Router()

router.post('/register', validateData(RegisterSchema), authController.register)
router.post('/login', validateData(LoginSchema), authController.login)
router.post('/logout', authMiddleware.verifyTokenCookie, authController.logout)
router.post('/refresh-token', authController.refreshToken)

router.post('/verify-account/:id', validateData(OTPSchema), authController.verifyAccount)
router.post('/forgot-password', validateData(ForgotPasswordSchema), authController.forgotPassword)
router.post('/reset-password/:token', validateData(ResetPasswordSchema), authController.resetPassword)

export default router
