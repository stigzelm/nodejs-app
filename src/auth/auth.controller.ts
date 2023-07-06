import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @HttpCode(HttpStatus.OK)
    @Get('verify/:VERIFICATION_CODE')
    verify(@Param('VERIFICATION_CODE') verificationCode: string) {
        return this.authService.verify(verificationCode);
    }
}
