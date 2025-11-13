import { IsBoolean, IsNotEmpty } from 'class-validator';

export class CloseDealDto {
  @IsBoolean()
  @IsNotEmpty()
  won: boolean;
}
