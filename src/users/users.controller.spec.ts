import { Test, TestingModule } from '@nestjs/testing';
import { listUsersQuerySchema } from './schemas/list-users.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: jest.Mocked<UsersService>;

  const publicUser = {
    id: 'u1',
    name: 'Alice',
    email: 'alice@test.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findPublicUsers: jest.fn(),
            findPublicUser: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get(UsersService);
  });

  describe('create', () => {
    it('should delegate to usersService.create', async () => {
      const dto = {
        name: 'Alice',
        email: 'alice@test.com',
        password: 'pass123',
      };
      usersService.create.mockResolvedValue(publicUser);

      expect(await controller.create(dto)).toEqual(publicUser);
      expect(usersService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should delegate to usersService.findPublicUsers', async () => {
      usersService.findPublicUsers.mockResolvedValue([publicUser]);

      expect(await controller.findAll()).toEqual([publicUser]);
      expect(usersService.findPublicUsers).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should delegate to usersService.findPublicUser with the id param', async () => {
      usersService.findPublicUser.mockResolvedValue(publicUser);

      expect(await controller.findById({ id: 'u1' })).toEqual(publicUser);
      expect(usersService.findPublicUser).toHaveBeenCalledWith('u1');
    });
  });

  describe('update', () => {
    it('should delegate to usersService.update with id and body', async () => {
      usersService.update.mockResolvedValue(publicUser);

      expect(
        await controller.update({ id: 'u1' }, { email: 'new@test.com' }),
      ).toEqual(publicUser);
      expect(usersService.update).toHaveBeenCalledWith('u1', {
        email: 'new@test.com',
      });
    });
  });

  describe('remove', () => {
    it('should delegate to usersService.delete with the id param', async () => {
      usersService.delete.mockResolvedValue({
        message: 'User deleted successfully',
      });

      expect(await controller.remove({ id: 'u1' })).toEqual({
        message: 'User deleted successfully',
      });
      expect(usersService.delete).toHaveBeenCalledWith('u1');
    });
  });

  describe('listUsersQuerySchema', () => {
    it('should parse with defaults', () => {
      const result = listUsersQuerySchema.parse({});
      expect(result).toEqual({ page: 1, limit: 10 });
    });
  });
});
