import { IsInt, IsNotEmpty, Min } from 'class-validator'

export class JobsPaginate {
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  page: number

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  limit: number

  userId: number
}
