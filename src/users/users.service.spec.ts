import { NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UsersModule } from './users.module';
import { UsersService } from './users.service';

describe('UsersModule', () => {
  it('should be defined', () => {
    expect(UsersModule).toBeDefined();
  });
});

describe('UsersService', () => {
  let service: UsersService;
  let prisma: { user: Record<string, jest.Mock> };

  const publicUser = {
    id: 'u1',
    name: 'Luks',
    email: 'luks@test.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    prisma = {
      user: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    service = new UsersService(prisma as any);
  });

  describe('create', () => {
    it('should call prisma.user.create and return result', async () => {
      const dto = {
        name: 'Luks',
        email: 'luks@test.com',
        password: 'hashed',
      };
      prisma.user.create.mockResolvedValue(publicUser);

      const result = await service.create(dto);

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: dto,
        select: expect.any(Object),
      });
      expect(result).toEqual(publicUser);
    });
  });

  describe('findAuthUser', () => {
    it('should return user by email', async () => {
      const user = { ...publicUser, password: 'hash' };
      prisma.user.findUnique.mockResolvedValue(user);

      const result = await service.findAuthUser('luks@test.com');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'luks@test.com' },
      });
      expect(result).toEqual(user);
    });

    it('should return null when user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      expect(await service.findAuthUser('none@test.com')).toBeNull();
    });
  });

  describe('findPublicUser', () => {
    it('should return user when found', async () => {
      prisma.user.findUnique.mockResolvedValue(publicUser);

      const result = await service.findPublicUser('u1');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'u1' },
        select: expect.any(Object),
      });
      expect(result).toEqual(publicUser);
    });

    it('should throw NotFoundException when not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      await expect(service.findPublicUser('missing')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findPublicUsers', () => {
    it('should call findMany with default take=10 when no params', async () => {
      prisma.user.findMany.mockResolvedValue([publicUser]);

      const result = await service.findPublicUsers();

      expect(prisma.user.findMany).toHaveBeenCalledWith({
        skip: undefined,
        take: 10,
        select: expect.any(Object),
      });
      expect(result).toEqual([publicUser]);
    });

    it('should forward skip/take when provided', async () => {
      prisma.user.findMany.mockResolvedValue([]);
      await service.findPublicUsers({ skip: 5, take: 20 });
      expect(prisma.user.findMany).toHaveBeenCalledWith({
        skip: 5,
        take: 20,
        select: expect.any(Object),
      });
    });
  });

  describe('update', () => {
    it('should call prisma.user.update and return result', async () => {
      prisma.user.update.mockResolvedValue(publicUser);

      const result = await service.update('u1', { email: 'new@test.com' });

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'u1' },
        data: { email: 'new@test.com' },
        select: expect.any(Object),
      });
      expect(result).toEqual(publicUser);
    });

    it('should throw NotFoundException on PrismaClientKnownRequestError', async () => {
      const prismaError = new Prisma.PrismaClientKnownRequestError(
        'Record not found',
        { code: 'P2025', clientVersion: '5.0.0' },
      );
      prisma.user.update.mockRejectedValue(prismaError);
      await expect(service.update('missing', {})).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should rethrow unknown errors', async () => {
      const unknownError = new Error('DB crash');
      prisma.user.update.mockRejectedValue(unknownError);
      await expect(service.update('u1', {})).rejects.toThrow('DB crash');
    });
  });

  describe('delete', () => {
    it('should call prisma.user.delete and return message', async () => {
      prisma.user.delete.mockResolvedValue(undefined);

      const result = await service.delete('u1');

      expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: 'u1' } });
      expect(result).toEqual({ message: 'User deleted successfully' });
    });
  });
});
