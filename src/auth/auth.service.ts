import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { LoginInput } from './dto/auth.input';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) {}

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

        if (password !== customer.password) {
            throw new UnauthorizedException();
        }

        const accessToken = "accessToken-comes-here";
        const refreshToken = "refreshToken-comes-here";

        return { accessToken, refreshToken };
    }
}
