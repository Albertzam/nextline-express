import { DTO } from '../common'
import { HttpException } from '../middlewares'
import { ErrorCodesApi } from '../middlewares/errors/error.constants'
import connection from '../db/connection'
import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'

class UserService {
  async register(userData: DTO.UserRegister): Promise<DTO.UserResponse> {
    const userCreate = await connection.query<string, []>(
      `SELECT * FROM user WHERE email = ?`,
      [userData.email]
    )

    if (userCreate.length)
      throw new HttpException(
        'Email is already registered',
        ErrorCodesApi.USER_ALREADY_EXISTS
      )

    await connection.query(
      `INSERT INTO user (name, email, password) VALUES (?, ? ,?)`,
      [userData.name, userData.email, await bcrypt.hash(userData.password, 10)]
    )

    return (
      await connection.query<string, DTO.UserResponse>(
        `SELECT id, name, email FROM user WHERE id = LAST_INSERT_ID()`
      )
    )[0]
  }

  private getAccessToken(payload: any): string {
    const accessToken = jwt.sign(payload, process.env.SECRET_JWT as string, {
      expiresIn: '12h',
    })
    return accessToken
  }

  async login(user: DTO.UserLogin): Promise<DTO.UserResponse> {
    const exist = await connection.query<string, DTO.UserResponse>(
      `SELECT id, name, email, password FROM user WHERE email = ? `,
      [user.email]
    )

    if (!exist.length)
      throw new HttpException('User not found', ErrorCodesApi.USER_NOT_FOUND)

    if (!(await bcrypt.compare(user.password, exist[0].password as string)))
      throw new HttpException(
        'Password is error',
        ErrorCodesApi.USER_ERROR_VALUES
      )

    return {
      ...exist[0],
      password: undefined,
      token: this.getAccessToken(exist[0]),
    }
  }
  async isAdmin(email: string): Promise<boolean> {
    const exist = (
      await connection.query('SELECT id FROM user WHERE email = ?', [email])
    )[0]

    return !!exist
  }
}

export default new UserService()
