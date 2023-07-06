import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty } from 'class-validator';

@InputType()
export class LoginInput {
  @IsNotEmpty()
  @IsEmail()
  @Field(() => String, { nullable: true })
  email: string;

  @IsNotEmpty()
  @Field(() => String, { nullable: true })
  password: string;
}

@ObjectType()
export class LoginOutput {
  @Field(() => String)
  accessToken: string;

  @Field(() => String)
  refreshToken: string;
}

@InputType()
export class RegisterInput {
  @IsNotEmpty()
  @IsEmail()
  @Field(() => String, { nullable: true })
  email: string;

  @IsNotEmpty()
  @Field(() => String, { nullable: true })
  password: string;
}

@ObjectType()
export class RegisterOutput {
  @Field(() => String)
  message: string;
}