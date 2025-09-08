import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { z, ZodError, ZodRawShape } from 'zod'

export const validateData = <T extends ZodRawShape>(schema: z.ZodObject<T>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body)
      next()
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((issue: z.core.$ZodIssue) => ({
          message: `${issue.path.join('.')} is ${issue.message}`
        }))
        res.status(StatusCodes.BAD_REQUEST).json({ error: 'Invalid data', details: errorMessages })
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' })
      }
    }
  }
}
