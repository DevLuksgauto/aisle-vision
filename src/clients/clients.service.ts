import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClientDto } from '@/clients/schemas/create-client.schema';
import { UpdateClientDto } from '@/clients/schemas/update-client.schema';
import { clientSelect } from '@/clients/selects/client.select';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: CreateClientDto) {
    return this.prisma.client.create({
      data: {
        ...data,
        userId,
      },
      select: clientSelect,
    });
  }

  async findAll(userId: string) {
    return this.prisma.client.findMany({
      where: { userId },
      select: clientSelect,
    });
  }

  async findById(userId: string, id: string) {
    const client = await this.prisma.client.findFirst({
      where: {
        id,
        userId,
      },
      select: clientSelect,
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    return client;
  }

  async update(userId: string, clientId: string, data: UpdateClientDto) {
    const client = await this.prisma.client.findFirst({
      where: { id: clientId, userId },
    });

    if (!client) {
      throw new NotFoundException('Client not found');
    }

    return this.prisma.client.update({
      where: {
        id: clientId,
      },
      data,
      select: clientSelect,
    });
  }

  async delete(userId: string, clientId: string) {
    const client = await this.prisma.client.findFirst({
      where: { id: clientId, userId },
    });

    if (!client) {
      throw new NotFoundException('Client not Found');
    }

    await this.prisma.client.delete({
      where: {
        id: userId,
      },
    });

    return { message: 'Client deleted successfully' };
  }
}
