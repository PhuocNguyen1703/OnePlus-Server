import { Response } from 'express'
import { errorTypes } from './errors'
import { StatusCodes } from 'http-status-codes'

export const handleControllerError = (res: Response, error: unknown) => {
  if (errorTypes.some((type) => error instanceof type)) {
    const customError = error as { status: number; message: string }
    return res.status(customError.status).json({ errors: { message: customError.message, error } })
  } else {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ errors: { message: 'Internal server error.', error } })
  }
}
