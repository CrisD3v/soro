import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UploadDocumentDto {
  @ApiProperty({ example: 'Contrato de servicios.pdf' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'contrato-servicios.pdf' })
  @IsString()
  fileName: string;

  @ApiProperty({ example: '/uploads/documents/uuid.pdf' })
  @IsString()
  filePath: string;

  @ApiProperty({ example: 1024000 })
  @IsNumber()
  fileSize: number;

  @ApiProperty({ example: 'application/pdf' })
  @IsString()
  mimeType: string;

  @ApiPropertyOptional({ example: 'uuid-project-id' })
  @IsOptional()
  @IsString()
  projectId?: string;
}
