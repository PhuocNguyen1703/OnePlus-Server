import { ErrorRequestHandler, NextFunction, Request, Response } from 'express'
import { ApiResponse } from '~/utils/apiResponse'
import { EntityError } from '~/utils/errors'

export const errorHandler: ErrorRequestHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal Server Error'

  if (err instanceof EntityError) {
    res.status(statusCode).json({
      success: false,
      message,
      fields: err.fields
    })
    return
  }

  res.status(statusCode).json(new ApiResponse(false, message))
}
