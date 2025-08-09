import express from 'express'
import { authController } from '~/controllers/auth.controller'
import { validateData } from '~/middleware/validation'
import { authMiddleware } from '~/middleware/verifyToken'
import { ForgotPasswordBody, LoginBody, OTPBody, RegisterBody, ResetPasswordBody } from '~/schemas/auth.schema'

const router = express.Router()

router.post('/register', validateData(RegisterBody), authController.register)
router.post('/login', validateData(LoginBody), authController.login)
router.post('/logout', authMiddleware.verifyTokenCookie, authController.logout)
router.post('/refresh-token', authController.refreshToken)

router.post('/verify-email/:id', validateData(OTPBody), authController.verifyEmail)
router.post('/forgot-password', validateData(ForgotPasswordBody), authController.forgotPassword)
router.post('/reset-password/:token', validateData(ResetPasswordBody), authController.resetPassword)

export default router
