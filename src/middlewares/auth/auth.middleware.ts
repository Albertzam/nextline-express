/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response, NextFunction } from 'express'
import * as jwt from 'jsonwebtoken'
import { HttpException } from '../errors/httpException'
import { GeneralErrorCodes } from '../errors/error.constants'
import { CustomRequest } from '../../common/constants/request'
import userService from '../../services/user.service'

export const AuthMiddleware = (isAdmin = false) => {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization

    const token = authHeader && authHeader.split(' ')[1]

    if (token == null)
      next(
        new HttpException('User not authorized', GeneralErrorCodes.UNAUTHORIZED)
      )
    else {
      jwt.verify(
        token,
        process.env.SECRET_JWT as string,
        async (err: any, user: any) => {
          if (err) {
            next(
              new HttpException(
                'User not authorized',
                GeneralErrorCodes.UNAUTHORIZED
              )
            )
          } else {
            if (isAdmin) {
              const exist = await userService.isAdmin(user.email)
              if (!exist)
                next(
                  new HttpException(
                    'Route Forbidden',
                    GeneralErrorCodes.FORBIDDEN
                  )
                )
            }
            req.user = { userId: user.id }

            next()
          }
        }
      )
    }
  }
}
