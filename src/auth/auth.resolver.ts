import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput, LoginOutput, RegisterInput, RegisterOutput } from './dto/auth.input';

@Resolver()
export class AuthResolver {
    constructor(private readonly authService: AuthService) {}

    @Mutation(() => LoginOutput)
    async login(@Args('data') data:LoginInput) {
        return this.authService.login(data);
    }

    @Mutation(() => RegisterOutput)
    async register(@Args('data') data:RegisterInput) {
        return this.authService.register(data);
    }
}
