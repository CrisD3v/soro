import { CloseDealDto } from '@context/deal/application/dto/close-deal.dto';
import { CreateDealDto } from '@context/deal/application/dto/create-deal.dto';
import { DealResponseDto } from '@context/deal/application/dto/deal-response.dto';
import { UpdateDealDto } from '@context/deal/application/dto/update-deal.dto';
import { CloseDealUseCase } from '@context/deal/application/use-cases/close-deal.use-case';
import { CreateDealUseCase } from '@context/deal/application/use-cases/create-deal.use-case';
import { DeleteDealUseCase } from '@context/deal/application/use-cases/delete-deal.use-case';
import { GetDealUseCase } from '@context/deal/application/use-cases/get-deal.use-case';
import { ListDealsUseCase } from '@context/deal/application/use-cases/list-deals.use-case';
import { UpdateDealUseCase } from '@context/deal/application/use-cases/update-deal.use-case';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Request,
} from '@nestjs/common';

@Controller('deals')
export class DealController {
  constructor(
    private readonly createDealUseCase: CreateDealUseCase,
    private readonly updateDealUseCase: UpdateDealUseCase,
    private readonly getDealUseCase: GetDealUseCase,
    private readonly listDealsUseCase: ListDealsUseCase,
    private readonly deleteDealUseCase: DeleteDealUseCase,
    private readonly closeDealUseCase: CloseDealUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: CreateDealDto,
    @Request() req: any,
  ): Promise<DealResponseDto> {
    const deal = await this.createDealUseCase.execute(dto, req.user?.sub);
    return DealResponseDto.fromEntity(deal);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<DealResponseDto> {
    const deal = await this.getDealUseCase.execute(id);
    return DealResponseDto.fromEntity(deal);
  }

  @Get()
  async findAll(
    @Query('companyId') companyId?: string,
    @Query('contactId') contactId?: string,
    @Query('stage') stage?: string,
    @Query('assignedTo') assignedTo?: string,
  ): Promise<DealResponseDto[]> {
    const deals = await this.listDealsUseCase.execute({
      companyId,
      contactId,
      stage,
      assignedTo,
    });
    return deals.map((deal) => DealResponseDto.fromEntity(deal));
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateDealDto,
  ): Promise<DealResponseDto> {
    const deal = await this.updateDealUseCase.execute(id, dto);
    return DealResponseDto.fromEntity(deal);
  }

  @Post(':id/close')
  @HttpCode(HttpStatus.OK)
  async close(
    @Param('id') id: string,
    @Body() dto: CloseDealDto,
  ): Promise<DealResponseDto> {
    const deal = await this.closeDealUseCase.execute(id, dto.won);
    return DealResponseDto.fromEntity(deal);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.deleteDealUseCase.execute(id);
  }
}
