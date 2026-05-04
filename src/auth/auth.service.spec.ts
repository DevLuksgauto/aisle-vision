import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { UsersService } from '@/users/users.service';
import { AuthModule } from './auth.module';
import { AuthService } from './auth.service';

describe('AuthModule', () => {
  it('should be defined', () => {
    expect(AuthModule).toBeDefined();
  });
});

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: { create: jest.fn(), findAuthUser: jest.fn() },
        },
        {
          provide: JwtService,
          useValue: { signAsync: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('signup', () => {
    it('should hash the password and delegate to usersService.create', async () => {
      const dto = {
        name: 'Luks',
        email: 'luks@test.com',
        password: 'secret123',
      };
      const hashed = 'hashed_secret';
      const created = { id: 'u1', name: 'Luks', email: 'luks@test.com' };

      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashed as never);
      usersService.create.mockResolvedValue(created as any);

      const result = await service.signup(dto);

      expect(bcrypt.hash).toHaveBeenCalledWith('secret123', 10);
      expect(usersService.create).toHaveBeenCalledWith({
        ...dto,
        password: hashed,
      });
      expect(result).toEqual(created);
    });
  });

  describe('login', () => {
    it('should throw UnauthorizedException when user is not found', async () => {
      usersService.findAuthUser.mockResolvedValue(null);

      await expect(
        service.login({ email: 'luks@test.com', password: 'pass' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when password does not match', async () => {
      usersService.findAuthUser.mockResolvedValue({
        id: 'u1',
        email: 'luks@test.com',
        password: 'hash',
      } as any);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(
        service.login({ email: 'luks@test.com', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return access_token on valid credentials', async () => {
      const user = { id: 'u1', email: 'luks@test.com', password: 'hash' };
      usersService.findAuthUser.mockResolvedValue(user as any);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      jwtService.signAsync.mockResolvedValue('token123' as any);

      const result = await service.login({
        email: 'luks@test.com',
        password: 'pass',
      });

      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: 'u1',
        email: 'luks@test.com',
      });
      expect(result).toEqual({ access_token: 'token123' });
    });
  });
});
