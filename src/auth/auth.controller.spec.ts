import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<Pick<AuthService, 'signup' | 'login'>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: { signup: jest.fn(), login: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  it('JwtAuthGuard should be defined', () => {
    expect(JwtAuthGuard).toBeDefined();
  });

  describe('signup', () => {
    it('should return the result from authService.signup', async () => {
      const dto = {
        name: 'Alice',
        email: 'alice@test.com',
        password: 'secret123',
      };
      const result = { id: 'u1', name: 'Alice', email: 'alice@test.com' };
      (authService.signup as jest.Mock).mockResolvedValue(result);

      expect(await controller.signup(dto)).toEqual(result);
      expect(authService.signup).toHaveBeenCalledWith(dto);
    });
  });

  describe('login', () => {
    it('should return the result from authService.login', async () => {
      const dto = { email: 'alice@test.com', password: 'secret123' };
      const result = { access_token: 'jwt' };
      (authService.login as jest.Mock).mockResolvedValue(result);

      expect(await controller.login(dto)).toEqual(result);
      expect(authService.login).toHaveBeenCalledWith(dto);
    });
  });
});
