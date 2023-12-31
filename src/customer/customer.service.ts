import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { GetCustomersInput, GetCustomerInput, CreateCustomerInput, UpdateCustomerInput, DeleteCustomerInput } from './dto/customer.input';
import * as bcrypt from 'bcrypt';

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

    const existingCustomer = await this.prisma.customer.findUnique({
      where: {
        email: newCustomer.email
      }
    });
    if (existingCustomer) {
      throw new ConflictException('Email is already in use');
    }

    const hashedPassword = await this.encrypt(newCustomer.password);
    newCustomer.password = hashedPassword;

    return this.prisma.customer.create({ data: newCustomer });
  }

  // Update customer
  async update(params: UpdateCustomerInput) {

    const { id } = params;
    const customer = await this.findOne({ id });

    if ('password' in params) {
      const hashedPassword = await this.encrypt(params.password);
      params.password = hashedPassword;
    }

    return this.prisma.customer.update({ 
      data: params, 
      where: {
        id: customer.id
      }
    });
  }

  // Delete customer
  async delete(params: DeleteCustomerInput) {
    const customer = await this.findOne(params);

    return this.prisma.customer.delete({
      where: {
        id: customer.id
      }
    })
  }

  async encrypt(string: string) {
    return bcrypt.hash(string, 10);
  }

}
