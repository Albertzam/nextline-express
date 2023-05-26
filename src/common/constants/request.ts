import { Request } from 'express'
interface User {
  userId: number
}

export interface CustomRequest extends Request {
  user?: User
}
