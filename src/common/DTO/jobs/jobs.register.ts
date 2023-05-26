import { Transform } from 'class-transformer'
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator'
import moment from 'moment'

export class JobRegister {
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
  @IsOptional()
  userShared: Array<number>

  @IsNotEmpty()
  @IsDateString()
  @Transform(({ value }) => moment(value).format('YYYY-MM-DD hh:mm:ss'))
  submittedAt: string

  createdBy: number
  manager: number
}
