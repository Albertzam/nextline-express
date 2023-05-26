import {
  IsBoolean,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator'

export class JobResponse {
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

  @IsNotEmpty()
  @IsInt()
  createdBy?: number

  @IsInt()
  @IsNotEmpty()
  manager?: number

  status: string
  submittedAt: Date
}
