import { Args, Query, Resolver } from '@nestjs/graphql';
import { Customer } from 'lib/entities/customer.entity';
import { CustomerService } from './customer.service';
import { GetCustomersInput, GetCustomerInput } from './dto/customer.input';

@Resolver(() => Customer)
export class CustomerResolver {
  constructor(private readonly customerService: CustomerService) {}

  // Get a list of customers
  @Query(() => [Customer])
  async customers(@Args('data') { skip, take, where }: GetCustomersInput) {
    return this.customerService.findAll({ skip, take, where });
  }

  // Get one customer by id or email
  @Query(() => Customer)
  async customer(@Args('data') { id, email }: GetCustomerInput ) {
    return this.customerService.findOne({ id, email });
  }

  // Update customer by id or email

  // Create customer by id or email
  
}
