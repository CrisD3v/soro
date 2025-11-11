import { IsNotEmpty, IsString } from 'class-validator';

export class AssignSignatureDto {
  @IsString()
  @IsNotEmpty()
  signature: string;
}
