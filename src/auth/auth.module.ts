import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma.service';
import { CustomerService } from 'src/customer/customer.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AtStrategy, RtStrategy } from './strategies';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      global: true
    })
  ],
  controllers: [AuthController],
  providers: [AuthResolver, AuthService, PrismaService, CustomerService, JwtService, AtStrategy, RtStrategy]
})
export class AuthModule {}
