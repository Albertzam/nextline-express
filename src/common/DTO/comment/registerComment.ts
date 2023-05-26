import { IsNotEmpty, IsNumber, IsString, MaxLength, Min } from 'class-validator'

export class RegisterComment {
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  jobId: number

  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  comment: string

  userId: number
}
