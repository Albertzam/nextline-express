import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator'
import { ROLES_USERS } from '../../constants/roles.constants'

export class UserRegister {
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  name: string

  @IsNotEmpty()
  @IsEmail()
  email: string

  @IsNotEmpty()
  @IsString()
  password: string
}
