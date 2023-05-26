import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator'
import { STATUS_DB } from '../../constants/status.db'
import { Transform } from 'class-transformer'

export class SearchByQuery {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  word?: string

  @IsOptional()
  @IsEnum(STATUS_DB, { each: true })
  status?: string

  @IsOptional()
  @Transform(({ value }) => value == 'true')
  @IsBoolean()
  isPublic?: boolean

  @IsOptional()
  @IsDateString()
  date?: string

  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  page: number

  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  limit: number
}
