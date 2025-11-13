import { ContactResponseDto } from '@context/contact/application/dto/contact-response.dto';
import { CreateContactDto } from '@context/contact/application/dto/create-contact.dto';
import { UpdateContactDto } from '@context/contact/application/dto/update-contact.dto';
import { CreateContactUseCase } from '@context/contact/application/use-cases/create-contact.use-case';
import { DeleteContactUseCase } from '@context/contact/application/use-cases/delete-contact.use-case';
import { GetContactUseCase } from '@context/contact/application/use-cases/get-contact.use-case';
import { ListContactsUseCase } from '@context/contact/application/use-cases/list-contacts.use-case';
import { UpdateContactUseCase } from '@context/contact/application/use-cases/update-contact.use-case';
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

@Controller('contacts')
export class ContactController {
  constructor(
    private readonly createContactUseCase: CreateContactUseCase,
    private readonly updateContactUseCase: UpdateContactUseCase,
    private readonly getContactUseCase: GetContactUseCase,
    private readonly listContactsUseCase: ListContactsUseCase,
    private readonly deleteContactUseCase: DeleteContactUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() dto: CreateContactDto,
    @Request() req: any,
  ): Promise<ContactResponseDto> {
    const contact = await this.createContactUseCase.execute(dto, req.user?.sub);
    return ContactResponseDto.fromEntity(contact);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ContactResponseDto> {
    const contact = await this.getContactUseCase.execute(id);
    return ContactResponseDto.fromEntity(contact);
  }

  @Get()
  async findAll(
    @Query('companyId') companyId?: string,
    @Query('type') type?: string,
    @Query('email') email?: string,
    @Query('createdBy') createdBy?: string,
  ): Promise<ContactResponseDto[]> {
    const contacts = await this.listContactsUseCase.execute({
      companyId,
      type,
      email,
      createdBy,
    });
    return contacts.map((contact) => ContactResponseDto.fromEntity(contact));
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateContactDto,
  ): Promise<ContactResponseDto> {
    const contact = await this.updateContactUseCase.execute(id, dto);
    return ContactResponseDto.fromEntity(contact);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.deleteContactUseCase.execute(id);
  }
}
