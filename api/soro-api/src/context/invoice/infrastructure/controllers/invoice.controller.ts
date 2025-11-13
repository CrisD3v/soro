/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/infrastructure/guards/jwt-auth.guard';
import { CreateInvoiceDto } from '../../application/dto/create-invoice.dto';
import {
  InvoiceResponseDto,
  InvoiceStatisticsResponseDto,
} from '../../application/dto/invoice-response.dto';
import { RegisterPaymentDto } from '../../application/dto/register-payment.dto';
import { UpdateInvoiceDto } from '../../application/dto/update-invoice.dto';
import { CancelInvoiceUseCase } from '../../application/use-cases/cancel-invoice.use-case';
import { CreateInvoiceUseCase } from '../../application/use-cases/create-invoice.use-case';
import { GetInvoiceUseCase } from '../../application/use-cases/get-invoice.use-case';
import { GetStatisticsUseCase } from '../../application/use-cases/get-statistics.use-case';
import { ListInvoicesUseCase } from '../../application/use-cases/list-invoices.use-case';
import { RegisterPaymentUseCase } from '../../application/use-cases/register-payment.use-case';
import { SendInvoiceUseCase } from '../../application/use-cases/send-invoice.use-case';
import { UpdateInvoiceUseCase } from '../../application/use-cases/update-invoice.use-case';
import { InvoiceMapper } from '../mappers/invoice.mapper';

@ApiTags('Invoices')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('invoices')
export class InvoiceController {
  constructor(
    private readonly createInvoiceUseCase: CreateInvoiceUseCase,
    private readonly sendInvoiceUseCase: SendInvoiceUseCase,
    private readonly registerPaymentUseCase: RegisterPaymentUseCase,
    private readonly listInvoicesUseCase: ListInvoicesUseCase,
    private readonly getInvoiceUseCase: GetInvoiceUseCase,
    private readonly updateInvoiceUseCase: UpdateInvoiceUseCase,
    private readonly cancelInvoiceUseCase: CancelInvoiceUseCase,
    private readonly getStatisticsUseCase: GetStatisticsUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create new invoice' })
  @ApiResponse({ status: 201, type: InvoiceResponseDto })
  async create(
    @Request() req: any,
    @Body() dto: CreateInvoiceDto,
  ): Promise<InvoiceResponseDto> {
    const invoice = await this.createInvoiceUseCase.execute(
      dto,
      req.user.companyId as string,
    );
    return InvoiceMapper.toResponse(invoice);
  }

  @Get()
  @ApiOperation({ summary: 'List all invoices' })
  @ApiResponse({ status: 200, type: [InvoiceResponseDto] })
  async findAll(
    @Request() req: any,
    @Query('status') status?: string,
    @Query('contactId') contactId?: string,
    @Query('projectId') projectId?: string,
  ): Promise<InvoiceResponseDto[]> {
    const invoices = await this.listInvoicesUseCase.execute(
      req.user.companyId as string,
      {
        status,
        contactId,
        projectId,
      },
    );
    return invoices.map((invoice) => InvoiceMapper.toResponse(invoice));
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get invoice statistics' })
  @ApiResponse({ status: 200, type: InvoiceStatisticsResponseDto })
  async getStatistics(
    @Request() req: any,
  ): Promise<InvoiceStatisticsResponseDto> {
    return this.getStatisticsUseCase.execute(req.user.companyId as string);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get invoice by ID' })
  @ApiResponse({ status: 200, type: InvoiceResponseDto })
  async findOne(
    @Request() req: any,
    @Param('id') id: string,
  ): Promise<InvoiceResponseDto> {
    const invoice = await this.getInvoiceUseCase.execute(
      id,
      req.user.companyId as string,
    );
    return InvoiceMapper.toResponse(invoice);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update invoice' })
  @ApiResponse({ status: 200, type: InvoiceResponseDto })
  async update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateInvoiceDto,
  ): Promise<InvoiceResponseDto> {
    const invoice = await this.updateInvoiceUseCase.execute(
      id,
      req.user.companyId as string,
      dto,
    );
    return InvoiceMapper.toResponse(invoice);
  }

  @Post(':id/send')
  @ApiOperation({ summary: 'Send invoice to client' })
  @ApiResponse({ status: 200, type: InvoiceResponseDto })
  async send(
    @Request() req: any,
    @Param('id') id: string,
  ): Promise<InvoiceResponseDto> {
    const invoice = await this.sendInvoiceUseCase.execute(
      id,
      req.user.companyId as string,
    );
    return InvoiceMapper.toResponse(invoice);
  }

  @Post(':id/payments')
  @ApiOperation({ summary: 'Register payment for invoice' })
  @ApiResponse({ status: 201 })
  async registerPayment(
    @Request() req: any,
    @Param('id') id: string,
    @Body() dto: RegisterPaymentDto,
  ) {
    const payment = await this.registerPaymentUseCase.execute(
      id,
      req.user.companyId as string,
      dto,
    );
    return InvoiceMapper.toPaymentResponse(payment);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel invoice' })
  @ApiResponse({ status: 200, type: InvoiceResponseDto })
  async cancel(
    @Request() req: any,
    @Param('id') id: string,
  ): Promise<InvoiceResponseDto> {
    const invoice = await this.cancelInvoiceUseCase.execute(
      id,
      req.user.companyId as string,
    );
    return InvoiceMapper.toResponse(invoice);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete invoice' })
  @ApiResponse({ status: 204 })
  async remove(): Promise<void> {
    // TODO: Implementation
  }
}
