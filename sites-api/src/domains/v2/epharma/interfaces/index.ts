import { IEpharmaError, IPrescriptorData, RegisterDefaultField, RegisterQuiz } from '../../../../adapters/interfaces/epharma'

export interface RequestFieldsRegisterMember {
  fields: Record<string, any>
  quiz: Record<string, any>
}

export interface IRequestBodyRegisterMember {
  eans: string[]
  fields: RequestFieldsRegisterMember
  defaultQuiz: RegisterQuiz[]
  defaultFields: RegisterDefaultField[]
}

export interface IBodyRequestPreAuthorization {
  eans: string[]
  elegibilityToken: string
  prescriptor: IPrescriptorData
}

export interface IBodyRequestCustomerElegibility {
  ean: string
  fingerprint: string
  identifyCustomer: string
}

export interface IResponseCustomerElegibility {
  error?: IEpharmaError
  needsRegister: boolean
  needsDoctorData: boolean
  elegibilityToken: string | null
  tokenExpirationDate: string | null
}


