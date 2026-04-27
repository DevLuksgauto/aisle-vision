import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodPipe } from '@/common/helpers/zod.helper';
import { CreateUserDto, createUserSchema } from './schemas/create-users.schema';
import { UpdateUserDto, updateUserSchema } from './schemas/update-users.schema';
import { UserIdDto, userIdSchema } from './schemas/user-id.schema';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body(ZodPipe(createUserSchema)) body: CreateUserDto) {
    return this.usersService.create(body);
  }

  @Get()
  findAll() {
    return this.usersService.findPublicUsers();
  }

  @Get(':id')
  findById(@Param(ZodPipe(userIdSchema)) params: UserIdDto) {
    return this.usersService.findPublicUser(params.id);
  }

  @Patch(':id')
  update(
    @Param(ZodPipe(userIdSchema)) params: UserIdDto,
    @Body(ZodPipe(updateUserSchema)) body: UpdateUserDto,
  ) {
    return this.usersService.update(params.id, body);
  }

  @Delete(':id')
  remove(@Param(ZodPipe(userIdSchema)) params: UserIdDto) {
    return this.usersService.delete(params.id);
  }
}
