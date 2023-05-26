import { GeneralErrorCodes } from './error.constants'
import { HttpException } from './httpException'

export const coerceNextiaError = (
  error: Error | HttpException
): HttpException => {
  if (error.name !== 'nextLine') {
    return new HttpException(
      error.message,
      GeneralErrorCodes.UNKNOWN,
      undefined
    )
  }
  return error as unknown as HttpException
}
