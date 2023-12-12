import { MarketingAutomation, MarketingAutomationRepository } from "@mypharma/api-core"

interface GetMarketingAutomationServiceDTO {
  tenant: string
}

class GetMarketingAutomationService {
  constructor(private repository?: any) { }

  public async getMarketingAutomationSettings({ tenant }: GetMarketingAutomationServiceDTO) {
    let settings = new MarketingAutomation()

    if (!this.repository) {
      const data = await MarketingAutomationRepository.repo(tenant).find({ take: 1 })

      if (data.length > 0) {

        settings = data[0]
      }
    }

    if (!settings) {

      throw new Error('automation_settings_not_found')
    }

    return settings

  }
}


export default GetMarketingAutomationService