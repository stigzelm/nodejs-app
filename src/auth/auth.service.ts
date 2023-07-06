import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { LoginInput, RegisterInput, RfTokenInput } from './dto/auth.input';
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

        const isValidPassword = await bcrypt.compare(password, customer.password);

        if (!isValidPassword) {
            throw new UnauthorizedException();
        }

        const isVerified = customer.verified;
        if (!isVerified) {
            throw new UnauthorizedException();
        }

        const payload = {sub: customer.id, email: customer.email};
        const accessToken = await this.generateAccessToken(payload);
        const refreshToken = await this.generateRefreshToken(payload);

        await this.updateRtHash(customer.id, refreshToken);

        return { accessToken, refreshToken };
    }

    async register(params: RegisterInput) {
        const newCustomer = await this.customerService.create(params);

        const payload = {sub: newCustomer.id, email: newCustomer.email};
        const accessToken = await this.generateAccessToken(payload);
        const refreshToken = await this.generateRefreshToken(payload);

        await this.updateRtHash(newCustomer.id, refreshToken);

        return {
            message: "Register successfully"
        }
    }

    async refreshToken(params: RfTokenInput) {
        try {
            const {refreshToken} = params;
            const tokenData = await this.jwt.verifyAsync(refreshToken, {
                secret: process.env.JWT_SECRET
            });
            const customer = await this.customerService.findOne({id: tokenData.sub});
            if (!customer || !customer.hashedRt) {
              throw new UnauthorizedException('No customer found');
            }

            const isValidRfToken = await bcrypt.compare(refreshToken, customer.hashedRt);
            if (!isValidRfToken) {
                throw new UnauthorizedException('Token is not valid');
            }

            const payload = {sub: customer.id, email: customer.email};
            const newAccessToken = await this.generateAccessToken(payload);
            const newRefreshToken = await this.generateRefreshToken(payload);

            await this.updateRtHash(customer.id, newRefreshToken);

            return { 
                accessToken: newAccessToken,
                refreshToken: newRefreshToken
            };
        } catch (e) {
            throw new UnauthorizedException();
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

    async updateRtHash(userId: string, rt: string): Promise<void> {
        const hash = await bcrypt.hash(rt, 10);

        await this.prisma.customer.update({
            where: {
              id: userId,
            },
            data: {
              hashedRt: hash,
            },
        });
    }
}
