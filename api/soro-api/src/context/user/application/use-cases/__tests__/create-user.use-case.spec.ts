import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRepositoryPort } from '../../../domain/ports/user.repository.port';
import { CreateUserDto } from '../../dto/create-user.dto';
import { CreateUserUseCase } from '../create-user.use-case';

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let mockUserRepository: jest.Mocked<UserRepositoryPort>;

  beforeEach(async () => {
    mockUserRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findByDocumentNumber: jest.fn(),
      update: jest.fn(),
      list: jest.fn(),
      assignRole: jest.fn(),
      assignSignature: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserUseCase,
        {
          provide: 'UserRepositoryPort',
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    useCase = module.get<CreateUserUseCase>(CreateUserUseCase);
  });

  it('should be defined', () => {
    expect(useCase).toBeDefined();
  });

  describe('execute', () => {
    const createUserDto: CreateUserDto = {
      email: 'test@example.com',
      password: 'Test123456!',
      name: 'Test',
      lastName: 'User',
      documentNumber: '1234567890',
      documentType: 'CC',
      phone: '+573001234567',
      companyId: 'company-uuid',
    };

    it('should create a user successfully', async () => {
      const mockUser = {
        id: 'user-uuid',
        ...createUserDto,
        password: 'hashed-password',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.findByDocumentNumber.mockResolvedValue(null);
      mockUserRepository.create.mockResolvedValue(mockUser as any);

      const result = await useCase.execute(createUserDto);

      expect(result).toBeDefined();
      expect(result.email).toBe(createUserDto.email);
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(createUserDto.email);
      expect(mockUserRepository.findByDocumentNumber).toHaveBeenCalledWith(createUserDto.documentNumber);
      expect(mockUserRepository.create).toHaveBeenCalled();
    });

    it('should throw ConflictException if email already exists', async () => {
      mockUserRepository.findByEmail.mockResolvedValue({
        id: 'existing-user',
        email: createUserDto.email,
      } as any);

      await expect(useCase.execute(createUserDto)).rejects.toThrow(ConflictException);
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });

    it('should throw ConflictException if document number already exists', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.findByDocumentNumber.mockResolvedValue({
        id: 'existing-user',
        documentNumber: createUserDto.documentNumber,
      } as any);

      await expect(useCase.execute(createUserDto)).rejects.toThrow(ConflictException);
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });

    it('should hash the password before creating user', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.findByDocumentNumber.mockResolvedValue(null);
      mockUserRepository.create.mockResolvedValue({
        id: 'user-uuid',
        ...createUserDto,
        password: 'hashed-password',
      } as any);

      await useCase.execute(createUserDto);

      const createCall = mockUserRepository.create.mock.calls[0][0];
      expect(createCall.password).not.toBe(createUserDto.password);
      expect(createCall.password).toMatch(/^\$2[aby]\$/); // bcrypt hash pattern
    });
  });
});
