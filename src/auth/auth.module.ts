import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma.service';
import { CustomerService } from 'src/customer/customer.service';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      global: true
    })
  ],
  controllers: [],
  providers: [AuthResolver, AuthService, PrismaService, CustomerService, JwtService]
})
export class AuthModule {}
