import { Args, Query, Resolver, Mutation } from '@nestjs/graphql';
import { Customer } from 'lib/entities/customer.entity';
import { CustomerService } from './customer.service';
import { GetCustomersInput, GetCustomerInput, CreateCustomerInput } from './dto/customer.input';

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

  // Create customer by id or email
  @Mutation(() => Customer)
  async createCustomer(@Args('data') data: CreateCustomerInput) {
    return this.customerService.create(data);
  }

  // Update customer by id or email

  // Delete customer by id or email
  
}
