import { StatusCodes } from 'http-status-codes'

export class EntityError extends Error {
  fields: { message: string; field: string }[]
  statusCode: number = StatusCodes.UNPROCESSABLE_ENTITY
  constructor(fields: { message: string; field: string }[]) {
    super(`Request can't be processed because of invalid data.`)
    this.fields = fields
  }
}

export class NotfoundError extends Error {
  statusCode: number = StatusCodes.NOT_FOUND
  constructor(message: string) {
    super(message)
  }
}

export class ConflictError extends Error {
  statusCode: number = StatusCodes.CONFLICT
  constructor(message: string) {
    super(message)
  }
}

export class BadRequestError extends Error {
  statusCode: number = StatusCodes.BAD_REQUEST
  constructor(message: string) {
    super(message)
  }
}

export class InternalServerError extends Error {
  statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR
  constructor(message: string) {
    super(message)
  }
}

export class AuthError extends Error {
  statusCode: number = StatusCodes.UNAUTHORIZED
  constructor(message: string) {
    super(message)
  }
}

export class ForbiddenError extends Error {
  statusCode: number = StatusCodes.FORBIDDEN
  constructor(message: string) {
    super(message)
  }
}

export class CustomError extends Error {
  statusCode: number
  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
  }
}

export const errorTypes = [EntityError, NotfoundError, AuthError, ForbiddenError, CustomError]
