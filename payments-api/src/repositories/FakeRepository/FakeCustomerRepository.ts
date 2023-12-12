import { Customer } from "@mypharma/api-core";
import { CustomerServiceRepository } from "../internals";

class FakeCustomerRepository implements CustomerServiceRepository {
  private customers: Customer[] = []

  async createDoc(customer: Customer): Promise<Customer> {
    this.customers.push(customer)

    return customer
  }

  async findOne(id: string): Promise<Customer | null> {
    const customer = this.customers.find(_customer => _customer._id.toString() === id)

    return customer
  }
}

export default FakeCustomerRepository

