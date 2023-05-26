import { Request, Response, NextFunction } from 'express'
import { logger } from '../../logger/logger'
import logService from '../../services/log.service'
import { CustomRequest } from '../../common/constants/request'

export const requestMiddleware =
  () => (req: CustomRequest, res: Response, next: NextFunction) => {
    const { ip, method, originalUrl, query, body } = req

    logger.info('http request received', {
      network: {
        client: {
          ip,
        },
      },
      http: {
        method,
        url: originalUrl,
        query: JSON.stringify(query),
        body,
      },
    })

    res.on('close', async () => {
      const { statusCode, statusMessage } = res

      logger.info('http request finished', {
        network: {
          client: {
            ip,
          },
        },
        http: {
          status_code: statusCode,
          url: originalUrl,
        },
      })
      await logService.createLog({
        finishedAt: new Date(),
        action: originalUrl,
        description:
          req.method.toLowerCase() == 'get' ||
          req.method.toLowerCase() == 'delete'
            ? JSON.stringify(req.query)
            : JSON.stringify(req.body),
        userId: req.user?.userId ? req.user.userId : 0,
        code: statusCode,
        error: statusMessage,
      })
    })

    next()
  }
