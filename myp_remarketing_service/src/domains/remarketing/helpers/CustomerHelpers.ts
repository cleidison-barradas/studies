import { CustomerRepository } from "@mypharma/api-core"

export function GetCustomers(tenant: string) {
  return CustomerRepository.repo(tenant).find({
    where: {
      subscribed: { $exists: false }
    },
    select: ['_id', 'fullName', 'email']
  })
}