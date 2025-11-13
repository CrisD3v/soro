/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateInvoiceItemDto {
  @ApiProperty({ example: 'Web Development Services' })
  @IsString()
  description: string;

  @ApiProperty({ example: 40 })
  @IsNumber()
  @Min(0)
  quantity: number;

  @ApiProperty({ example: 50.0 })
  @IsNumber()
  @Min(0)
  unitPrice: number;

  @ApiPropertyOptional({ example: 16 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  taxRate?: number;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discountRate?: number;
}

export class CreateInvoiceDto {
  @ApiProperty({ example: 'INV-2024-001' })
  @IsString()
  invoiceNumber: string;

  @ApiPropertyOptional({ example: 'uuid-contact-id' })
  @IsOptional()
  @IsString()
  contactId?: string;

  @ApiPropertyOptional({ example: 'uuid-project-id' })
  @IsOptional()
  @IsString()
  projectId?: string;

  @ApiProperty({ example: '2024-01-15' })
  @IsDateString()
  issueDate: string;

  @ApiProperty({ example: '2024-02-15' })
  @IsDateString()
  dueDate: string;

  @ApiPropertyOptional({ enum: ['DRAFT', 'SENT'], example: 'DRAFT' })
  @IsOptional()
  @IsEnum(['DRAFT', 'SENT'])
  status?: 'DRAFT' | 'SENT';

  @ApiProperty({ example: 'USD' })
  @IsString()
  currency: string;

  @ApiPropertyOptional({ example: 'Thank you for your business' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ example: 'Payment due within 30 days' })
  @IsOptional()
  @IsString()
  terms?: string;

  @ApiProperty({ type: [CreateInvoiceItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateInvoiceItemDto)
  items!: CreateInvoiceItemDto[];

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  taxAmount?: number;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discountAmount?: number;
}
