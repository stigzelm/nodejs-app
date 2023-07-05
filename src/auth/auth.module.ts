import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma.service';
import { CustomerService } from 'src/customer/customer.service';

@Module({
  imports: [],
  controllers: [],
  providers: [AuthResolver, AuthService, PrismaService, CustomerService]
})
export class AuthModule {}
