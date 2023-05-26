import { Transform } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'

export class DeleteGeneral {
  @Transform(({ value }) => parseInt(value))
  @IsNotEmpty()
  id: number

  userId: number
}
