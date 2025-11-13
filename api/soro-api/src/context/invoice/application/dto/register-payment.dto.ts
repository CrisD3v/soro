import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class RegisterPaymentDto {
  @ApiProperty({ example: 2000.0 })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({ example: '2024-01-20' })
  @IsDateString()
  paymentDate: string;

  @ApiProperty({ example: 'BANK_TRANSFER' })
  @IsString()
  paymentMethod: string;

  @ApiPropertyOptional({ example: 'TXN-123456' })
  @IsOptional()
  @IsString()
  reference?: string;

  @ApiPropertyOptional({ example: 'Payment received via bank transfer' })
  @IsOptional()
  @IsString()
  notes?: string;
}
