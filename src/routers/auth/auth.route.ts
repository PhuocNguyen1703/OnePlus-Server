import express from 'express'
import { authController } from '~/controllers/auth.controller'
import { validateData } from '~/middlewares/validation'
import { authMiddleware } from '~/middlewares/verifyToken'
import {
  forgotPasswordSchema,
  loginSchema,
  OTPSchema,
  registerSchema,
  resetPasswordSchema
} from '~/schemas/auth.schema'

const router = express.Router()

router.post('/register', validateData(registerSchema), authController.register)
router.post('/login', validateData(loginSchema), authController.login)
router.post('/logout', authMiddleware.verifyTokenCookie, authController.logout)
router.post('/refresh-token', authController.refreshToken)

router.post('/verify-account/:id', validateData(OTPSchema), authController.verifyAccount)
router.post('/forgot-password', validateData(forgotPasswordSchema), authController.forgotPassword)
router.post('/reset-password/:token', validateData(resetPasswordSchema), authController.resetPassword)

export default router
