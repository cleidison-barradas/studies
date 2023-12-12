import { Store } from '@mypharma/api-core'
import EpharmaService from '../../../../adapters/EpharmaService'
import { RegisterDefaultField, RegisterQuiz } from '../../../../adapters/interfaces/epharma'
import { RequestFieldsRegisterMember } from '../interfaces'
import EpharmaParseQuizService from './EpharmaParseQuizService'
import EpharmaParseFieldsService from './EpharmaParseFieldsService'

interface EpharmaRegisterCustomerServiceDTO {
  store: Store
  benefitId: number
  defaultQuiz: RegisterQuiz[]
  defaultFields: RegisterDefaultField[]
  fields: RequestFieldsRegisterMember
}

class EpharmaRegisterCustomerService {
  private epharmaService: EpharmaService
  private epharmaParseQuizService: EpharmaParseQuizService
  private epharmaParseFieldsService: EpharmaParseFieldsService

  constructor(private repository?: any) {
    this.epharmaService = new EpharmaService()
    this.epharmaParseQuizService = new EpharmaParseQuizService()
    this.epharmaParseFieldsService = new EpharmaParseFieldsService()
  }

  public async registerCustomer({ store, fields, defaultFields, defaultQuiz, benefitId }: EpharmaRegisterCustomerServiceDTO) {
    const storeId = store._id.toString()

    this.epharmaService.config({ store })

    const accessToken = await this.epharmaService.authenticate({ storeId })

    const fieldsParsed = this.epharmaParseFieldsService.parserFields({ fields: fields.fields, defaultFields })

    const quizParsed = this.epharmaParseQuizService.parserQuiz({ quiz: fields.quiz, defaultQuiz })

    const registerResponse = await this.epharmaService.postBeneficiaryRegister({ accessToken, benefitId, fields: fieldsParsed, quiz: quizParsed })

    if (registerResponse.error) {
      console.log(registerResponse.error, registerResponse.messages)

      throw new Error('failure_on_register')
    }

    return registerResponse
  }
}


export default EpharmaRegisterCustomerService
