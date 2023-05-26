/* eslint-disable @typescript-eslint/no-explicit-any */
import cors from 'cors'
import express, { NextFunction, Request, Response } from 'express'
import helmet from 'helmet'
import dotenv from 'dotenv'
import { logger } from './logger/logger'
import { ErrorMiddleware, requestMiddleware } from './middlewares'
import routesLoaded from './routes'
import db from './db/connection'
import { config } from './config'
import { CreateTableGeneral } from './db/generateTable'
import {
  JobsTable,
  UserTable,
  SharedTable,
  CommentsTable,
  LogTable,
} from './schemas'
import userService from './services/user.service'

const bootstrap = async () => {
  dotenv.config()
  //verify env variables exist
  await config.getEnv()
  const appExpress = express()
  const errorMiddleware = new ErrorMiddleware()
  appExpress.use(requestMiddleware())
  appExpress.use(express.urlencoded({ extended: true }))
  appExpress.use(express.json())
  appExpress.use(cors())
  appExpress.use(helmet())
  const routes = express.Router()
  const tableGeneral = new CreateTableGeneral()

  routesLoaded(routes)
  appExpress.use('/', routes)
  appExpress.use(
    (error: any, req: Request, res: Response, next: NextFunction) => {
      errorMiddleware.handleError(error, req, res, next)
    }
  )

  await db.connect()
  await tableGeneral.loadTable(JobsTable)
  await tableGeneral.loadTable(UserTable)
  await tableGeneral.loadTable(SharedTable)
  await tableGeneral.loadTable(CommentsTable)
  await tableGeneral.loadTable(LogTable)

  if (db.getConnection()) {
    appExpress.listen(process.env.PORT, async () => {
      logger.info(
        `${process.pid} Express is listening on http://localhost:${process.env.PORT}`
      )
      await userService
        .register({
          email: 'admin@admin.com',
          password: '123',
          name: 'admin',
        })
        .catch((e) => console.log(e))
    })
  }
}

bootstrap()
