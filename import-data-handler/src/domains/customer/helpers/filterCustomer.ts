import { IImportCustomer } from "../../../interfaces/customer"

export function filterCustomers(data: IImportCustomer[]) {
  const customers = new Map<string, IImportCustomer>()
  const filted: IImportCustomer[] = []

  data.filter(_customer =>
    typeof _customer.email !== 'undefined' && _customer.email.length > 0 &&
    typeof _customer.name !== 'undefined' && _customer.name.length > 0).forEach(customer => {
      if (!customers.has(customer.email)) {
        customers.set(customer.email, customer)
      }
    })

  customers.forEach(c => filted.push(c))


  return filted
}