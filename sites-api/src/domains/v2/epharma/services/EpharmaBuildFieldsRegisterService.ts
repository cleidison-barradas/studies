import { Store } from '@mypharma/api-core'
import EpharmaService from '../../../../adapters/EpharmaService'
import EpharmaFilterFieldsService from './EpharmaFilterFieldsService'

interface EpharmaBuildFieldsRegisterServiceDTO {
  store: Store
  eans: string[]
  benefitId: number
}

class EpharmaBuildFieldsRegisterService {
  private epharmaService: EpharmaService
  private epharmaFilterFieldsService: EpharmaFilterFieldsService

  constructor(private repository?: any) {
    this.epharmaService = new EpharmaService()
    this.epharmaFilterFieldsService = new EpharmaFilterFieldsService()
  }

  public async fieldsRegisterConfiguration({ eans = [], store, benefitId }: EpharmaBuildFieldsRegisterServiceDTO) {
    const storeId = store._id.toString()

    this.epharmaService.config({ store })

    const accessToken = await this.epharmaService.authenticate({ storeId })

    const registerResponse = await this.epharmaService.getBeneficiaryRegisterConfig({ accessToken, benefitId, eans })

    if (registerResponse.error) {

      throw new Error('request_config_register_error')
    }
    const { data } = registerResponse

    const quiz = data.quiz

    const fields = this.epharmaFilterFieldsService.filterFields({ fields: data.fields })

    return {
      quiz,
      fields,
      defaultFields: data.fields,
    }
  }
}


export default EpharmaBuildFieldsRegisterService
