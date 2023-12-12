import { IPrescriptorData, RegisterDefaultField, RegisterQuiz } from "../../interfaces/epharma"
import { PBMAuthorization } from "../../interfaces/pbmAuthorization"

interface IEpharmaError {
  code: number
  message: string
}

interface MemberRegisterFiedls {
  quiz: any[]
  fields: any[]
}

export interface RequestBeneficiaryProductInfo {
  ean?: string
  benefitId?: number
}

export interface RequestBeneficiaryElegibility {
  ean?: string
  identifier?: string
  benefitId?: number
}

export interface RequestBeneficiaryRegisterConfig {
  eans?: string[]
  benefitId?: number
}

export interface RequestBeneficiaryIsElegible {
  ean: string
  benefitId: number
  fingerprint: string | null
  identifier: string
}
export interface RequestBeneficiaryMemberRegister {
  eans: string[]
  benefitId: number
  fields: MemberRegisterFiedls | null
  defaultFields: RegisterDefaultField[]
  defaultQuiz: RegisterQuiz[]
}

export interface RequestCustomerElegibility {
  ean: string
  benefitId: number
  fingerprint: string
  identifyCustomer: string
}

export interface ResponseCustomerElegibility {
  error?: IEpharmaError
  needsRegister: boolean
  needsDoctorData: boolean
  authorization: PBMAuthorization | null
}

export interface RequestCustomerPreAuthorization {
  eans: string[]
  elegibilityToken: string
  fingerprint: string | null
  prescriptor: IPrescriptorData
}

export interface ResponseCustomerPreAuthorization {
  authorization: any[]
}

export interface RequestAuthorization {
  fingerprint: string
}

export interface RequestUpdateAuthorization {
  ean: string
  fingerprint: string
}
