import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { ClientsModule } from './clients/clients.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule, ClientsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
