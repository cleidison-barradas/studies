import { CustomerRepository } from "@mypharma/api-core";

export function getCustomers(emails: string[], tenant: string) {
  return CustomerRepository.repo(tenant).find({
    where: {
      email: { $in: emails }
    }
  })
}