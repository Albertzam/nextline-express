import { Transform } from 'class-transformer'
import { IsInt, IsNotEmpty, Min } from 'class-validator'

export class JobsPaginate {
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

  userId: number
}
