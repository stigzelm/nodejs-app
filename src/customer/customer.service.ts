import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { GetCustomersInput, GetCustomerInput } from './dto/customer.input';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}

  // Find multiple customers
  async findAll(params: GetCustomersInput) {
    const { skip, take, cursor, where } = params;

    return this.prisma.customer.findMany({
      skip,
      take,
      cursor,
      where,
    });
  }

  // Find one customer
  async findOne(params: GetCustomerInput) {
    const { id, email } = params;
    const customer = await this.prisma.customer.findUnique({
      where: {
        id,
        email
      }
    });
    
    if (!customer) {
      throw new NotFoundException();
    }

    return customer;
  
  }
}
