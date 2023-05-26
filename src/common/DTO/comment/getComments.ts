import { Transform } from 'class-transformer'
import { IsNotEmpty, IsNumber, Min } from 'class-validator'

export class GetComments {
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  page: number

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  limit: number

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  jobId: number

  userId: number
}
