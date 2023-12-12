import { IntegrationUserErpRepository } from '@mypharma/api-core'

export function GetUsers() {
  return IntegrationUserErpRepository.repo().find({
    where: {
      erpId: { $size: 1 },
      store: { $size: 1 }
    }
  })
}
