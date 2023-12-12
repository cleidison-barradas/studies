import { IntegrationErpRepository } from '@mypharma/api-core'

export default function GetErps(integration: string) {

  return IntegrationErpRepository.repo(integration).find({
    where: {
      apiIntegration: true
    }
  })
}
