import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { LoginInput, RegisterInput } from './dto/auth.input';
import { CustomerService } from 'src/customer/customer.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
        private readonly customerService: CustomerService
    ) {}

    async login(params: LoginInput) {
        const { email, password } = params;
        // Find the customer
        const customer = await this.prisma.customer.findUnique({
            where: {
                email: email
            }
        });

        if (!customer) {
            throw new UnauthorizedException();
        }

        if (!bcrypt.compare(password, customer.password)) {
            throw new UnauthorizedException();
        }

        const payload = {sub: customer.id, email: customer.email};
        const accessToken = await this.generateAccessToken(payload);
        const refreshToken = await this.generateRefreshToken(payload);

        return { accessToken, refreshToken };
    }

    async register(params: RegisterInput) {
        await this.customerService.create(params);

        return {
            message: "Register successfully"
        }
    }

    async generateAccessToken(payload: { sub: string, email: string }): Promise<string> {
        return this.jwt.signAsync(payload, {
          secret: process.env.JWT_SECRET,
          expiresIn: '15m'
        });
    }

    async generateRefreshToken(payload: { sub: string, email: string }): Promise<string> {
        return this.jwt.signAsync(payload, {
          secret: process.env.JWT_SECRET,
          expiresIn: '7d'
        });
    }
}
