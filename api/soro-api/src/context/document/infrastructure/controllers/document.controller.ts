/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Body, Controller, Delete, Get, Param, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { DocumentResponseDto } from '../../application/dto/document-response.dto';
import { UploadDocumentDto } from '../../application/dto/upload-document.dto';
import { DeleteDocumentUseCase } from '../../application/use-cases/delete-document.use-case';
import { ListDocumentsUseCase } from '../../application/use-cases/list-documents.use-case';
import { UploadDocumentUseCase } from '../../application/use-cases/upload-document.use-case';
import { DocumentMapper } from '../mappers/document.mapper';

@ApiTags('Documents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('documents')
export class DocumentController {
  constructor(
    private readonly uploadDocumentUseCase: UploadDocumentUseCase,
    private readonly listDocumentsUseCase: ListDocumentsUseCase,
    private readonly deleteDocumentUseCase: DeleteDocumentUseCase,
  ) { }

  @Post()
  @ApiOperation({ summary: 'Upload document metadata' })
  @ApiResponse({ status: 201, type: DocumentResponseDto })
  async upload(
    @Request() req: any,
    @Body() dto: UploadDocumentDto,
  ): Promise<DocumentResponseDto> {
    const document = await this.uploadDocumentUseCase.execute(
      dto,
      req.user.sub as string,
      req.user.companyId as string,
    );
    return DocumentMapper.toResponse(document);
  }

  @Get()
  @ApiOperation({ summary: 'List documents' })
  @ApiResponse({ status: 200, type: [DocumentResponseDto] })
  @ApiQuery({ name: 'projectId', required: false, type: String })
  async findAll(
    @Request() req: any,
    @Query('projectId') projectId?: string,
  ): Promise<DocumentResponseDto[]> {
    const documents = await this.listDocumentsUseCase.execute(
      req.user.companyId as string,
      projectId,
    );
    return documents.map((doc) => DocumentMapper.toResponse(doc));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete document' })
  @ApiResponse({ status: 204 })
  async remove(
    @Request() req: any,
    @Param('id') id: string,
  ): Promise<void> {
    await this.deleteDocumentUseCase.execute(id, req.user.companyId as string);
  }
}
