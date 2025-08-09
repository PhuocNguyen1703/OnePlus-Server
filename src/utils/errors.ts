import { StatusCodes } from 'http-status-codes'

export class EntityError extends Error {
  fields: { message: string; field: string }[]
  status: number = StatusCodes.UNPROCESSABLE_ENTITY
  constructor(fields: { message: string; field: string }[]) {
    super(`Request can't be processed because of invalid data`)
    this.fields = fields
  }
}

export class NotfoundError extends Error {
  status: number = StatusCodes.NOT_FOUND
  message: string
  constructor(message: string) {
    super(message)
    this.message = message
  }
}

export class AuthError extends Error {
  status: number = StatusCodes.UNAUTHORIZED
  message: string
  constructor(message: string) {
    super(message)
    this.message = message
  }
}

export class ForbiddenError extends Error {
  status: number = StatusCodes.FORBIDDEN
  message: string
  constructor(message: string) {
    super(message)
    this.message = message
  }
}

export class CustomError extends Error {
  status: number
  constructor({ message, status }: { message: string; status: number }) {
    super(message)
    this.status = status
  }
}

export const errorTypes = [EntityError, NotfoundError, AuthError, ForbiddenError, CustomError]
