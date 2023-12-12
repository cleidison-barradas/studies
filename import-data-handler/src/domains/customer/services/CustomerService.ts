import { colors, Customer, CustomerRepository, logger } from "@mypharma/api-core";
import { IImportCustomer } from "../../../interfaces/customer";
import { filterCustomers } from "../helpers/filterCustomer";
import { getCustomers } from "../helpers/getCustomers";

const PROCESS_LIMIT: number = 1000

export const customerService = async (data: IImportCustomer[], tenant: string) => {
  const filtred = filterCustomers(data)
  const emails: string[] = []
  let inserted = 0
  filtred.forEach(x => emails.push(x.email))

  const storeCustomers = await getCustomers(emails, tenant)

  do {
    const customers = filtred.slice(0, PROCESS_LIMIT)
    const bulkWriteCustomers = []
    for await (const customerInfo of customers) {
      const exists = storeCustomers.find(x => x.email.includes(customerInfo.email))

      if (!exists) {
        let customer = new Customer()
        const [firstname, ...lastname] = customerInfo.name.split(' ')

        customer.email = customerInfo.email
        customer.fullName = customerInfo.name
        customer.phone = customerInfo.phone ? customerInfo.phone.replace(/\D+/g, "") : ""
        customer.firstname = firstname
        customer.lastname = lastname.toString().replace(/\,/g, " ")
        customer.status = true
        customer.addresses = []
        customer.createdAt = new Date()

        bulkWriteCustomers.push({
          insertOne: customer
        })
      }
    }

    filtred.splice(0, PROCESS_LIMIT)

    if (bulkWriteCustomers.length > 0) {
      const response = await CustomerRepository.repo(tenant).bulkWrite(bulkWriteCustomers)
      logger(`processed #${response.insertedCount} customers`, colors.FgYellow)
      inserted += response.insertedCount
    }

  } while (filtred.length > 0)

  return inserted
}