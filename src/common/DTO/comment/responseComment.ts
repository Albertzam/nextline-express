import { IsNotEmpty, IsNumber, IsString, MaxLength, Min } from 'class-validator'

export class ResponseComment {
  id: number
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  jobId: number

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  comment: string

  user: any
}
