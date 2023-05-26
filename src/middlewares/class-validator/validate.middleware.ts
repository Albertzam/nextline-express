/* eslint-disable @typescript-eslint/no-explicit-any */
import { validate } from 'class-validator'
import { Request, Response, NextFunction } from 'express'
import { BadRequest } from '../errors/class-validator'
import { plainToInstance } from 'class-transformer'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ValidateMiddleware = (dtoClass: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const data =
      req.method.toLowerCase() == 'get' || req.method.toLowerCase() == 'delete'
        ? plainToInstance(dtoClass, req.query)
        : plainToInstance(dtoClass, req.body)
    const dtoInstance = Object.assign(new dtoClass(), data)

    const errores = await validate(dtoInstance)

    if (errores.length > 0) {
      const mensajesErrores: string[] = []
      errores.forEach((error) =>
        mensajesErrores.push(
          ...Object.values(
            error.constraints as {
              [type: string]: string
            }
          )
        )
      )
      next(new BadRequest(mensajesErrores))
    }
    req.method.toLowerCase() == 'get' || req.method.toLowerCase() == 'delete'
      ? ((req.query as any) = data)
      : (req.body = data)
    next()
  }
}
