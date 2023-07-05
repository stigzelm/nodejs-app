import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { GetCustomersInput, GetCustomerInput, CreateCustomerInput } from './dto/customer.input';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}

  // Find multiple customers
  async findAll(params: GetCustomersInput) {
    return this.prisma.customer.findMany(params);
  }

  // Find one customer
  async findOne(params: GetCustomerInput) {
    const customer = await this.prisma.customer.findUnique({
      where: params
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return customer;
  
  }

  // Create customer
  async create(newCustomer: CreateCustomerInput) {

    const { email } = newCustomer;
    const existingCustomer = await this.prisma.customer.findUnique({
      where: {
        email
      }
    });
    if (existingCustomer) {
      throw new ConflictException('Email is already in use');
    }
    
    return this.prisma.customer.create({ data: newCustomer });
  }
}
