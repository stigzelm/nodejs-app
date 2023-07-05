import { Args, Query, Resolver } from '@nestjs/graphql';
import { Customer } from 'lib/entities/customer.entity';
import { CustomerService } from './customer.service';
import { GetCustomersInput, GetCustomerInput } from './dto/customer.input';

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

  // Update customer by id or email

  // Delete customer by id or email

  // Create customer by id or email

  
}
