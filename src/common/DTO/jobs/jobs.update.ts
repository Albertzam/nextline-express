import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator'
import { ROLES_USERS } from '../../constants/roles.constants'

export class JobUpdate {
  @IsNotEmpty()
  @IsInt()
  id: number

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  title: string

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  description: string

  @IsNotEmpty()
  @IsBoolean()
  isPublic: boolean

  @IsNotEmpty()
  @IsString()
  tags: string

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  userShared: Array<number>

  @IsEnum(ROLES_USERS)
  @IsNotEmpty()
  status: string

  createdBy: number
  manager: number
  userId: number
}
