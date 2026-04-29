import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { userPublicSelect } from '@/common/selects/user.select';
import type { PrismaService } from '@/prisma/prisma.service';
import type { CreateUserDto } from './schemas/create-users.schema';
import type { UpdateUserDto } from './schemas/update-users.schema';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    return this.prisma.user.create({
      data,
      select: userPublicSelect,
    });
  }

  async findAuthUser(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findPublicUser(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: userPublicSelect,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findPublicUsers(params?: { skip?: number; take?: number }) {
    return this.prisma.user.findMany({
      skip: params?.skip,
      take: params?.take ?? 10,
      select: userPublicSelect,
    });
  }

  async update(id: string, data: UpdateUserDto) {
    try {
      return await this.prisma.user.update({
        where: { id },
        data,
        select: userPublicSelect,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new NotFoundException('User not found');
      }
      throw error;
    }
  }

  async delete(id: string) {
    await this.prisma.user.delete({
      where: { id },
    });

    return { message: 'User deleted successfully' };
  }
}
