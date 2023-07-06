import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ROLES_KEY } from '../roles.decorator';
import { JwtService } from '@nestjs/jwt';
import { GqlExecutionContext } from '@nestjs/graphql';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private prisma: PrismaService,
        private reflector: Reflector,
        private jwt: JwtService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRoles) {
           return true;
        }
        
        const ctx = GqlExecutionContext.create(context);
        const request = ctx.getContext().req;
        const authHeader = request.headers.authorization;

        if (!authHeader) {
            throw new UnauthorizedException();
        }

        const token = authHeader.split(' ')[1];
        const tokenData = this.jwt.verify(token, {
            secret: process.env.JWT_SECRET
        });

        const customer = await this.prisma.customer.findUnique({
            where: {
                id: tokenData.sub
            }
        });

        if (!customer) {
            throw new UnauthorizedException();
        }

        return requiredRoles.some((role) => customer.role?.includes(role));
    }
}