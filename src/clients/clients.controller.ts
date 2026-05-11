import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { CurrentUserType } from '@/auth/types/current-user.type';
import {
  CreateClientDto,
  createClientSchema,
} from '@/clients/schemas/create-client.schema';
import {
  UpdateClientDto,
  updateClientSchema,
} from '@/clients/schemas/update-client.schema';
import { ZodPipe } from '@/common/helpers/zod.helper';
import { ClientsService } from './clients.service';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  create(
    @CurrentUser() user: CurrentUserType,
    @Body(ZodPipe(createClientSchema)) body: CreateClientDto,
  ) {
    return this.clientsService.create(user.userId, body);
  }

  @Get()
  findAll(@CurrentUser() user: CurrentUserType) {
    return this.clientsService.findAll(user.userId);
  }

  @Get(':id')
  findById(@CurrentUser() user: CurrentUserType, @Param('id') id: string) {
    return this.clientsService.findById(user.userId, id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: CurrentUserType,
    @Param('id') id: string,
    @Body(ZodPipe(updateClientSchema)) body: UpdateClientDto,
  ) {
    return this.clientsService.update(user.userId, id, body);
  }

  @Delete(':id')
  delete(@CurrentUser() user: CurrentUserType, @Param('id') id: string) {
    return this.clientsService.delete(user.userId, id);
  }
}
