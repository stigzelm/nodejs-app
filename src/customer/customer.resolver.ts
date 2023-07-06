import { Args, Query, Resolver, Mutation } from '@nestjs/graphql';
import { Customer } from 'lib/entities/customer.entity';
import { CustomerService } from './customer.service';
import { GetCustomersInput, GetCustomerInput, CreateCustomerInput, UpdateCustomerInput, DeleteCustomerInput } from './dto/customer.input';
import { UseGuards } from '@nestjs/common';
import { AtGuard } from 'src/auth/guards';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from '@prisma/client';

@UseGuards(AtGuard)
@Resolver(() => Customer)
export class CustomerResolver {
  constructor(private readonly customerService: CustomerService) {}

  // Get a list of customers
  @Query(() => [Customer])
  async customers(@Args('data') data?: GetCustomersInput) {
    return this.customerService.findAll(data);
  }

  // Get one customer by id or email
  @Query(() => Customer)
  async customer(@Args('data') data: GetCustomerInput ) {
    return this.customerService.findOne(data);
  }

  // Create customer
  @Mutation(() => Customer)
  async createCustomer(@Args('data') data: CreateCustomerInput) {
    return this.customerService.create(data);
  }

  // Update customer by id
  @Mutation(() => Customer)
  @Roles(Role.ADMIN)
  async updateCustomer(@Args('data') data: UpdateCustomerInput) {
    return this.customerService.update(data);
  }

  // Delete customer by id or email
  @Mutation(() => Customer)
  @Roles(Role.ADMIN)
  async deleteCustomer(@Args('data') data: DeleteCustomerInput) {
    return this.customerService.delete(data);
  }
}
