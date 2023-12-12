/**
 * 1 - CRM
 * 2 - CRO
 */
export type IMedicalProfessionalCouncil = 1 | 2

export type IEpharmaFieldsType = 'text' | 'select' | 'checkbox'

export interface BasicEpharmaResponse {
  sucess: boolean
  pagination: IPagination | null
  messages: string | null
  error: IEpharmaError | null
}

export interface IPrescriptorData {
  prescriptorId: number | null
  prescriptorName: string | null
  prescritorState: string | null
  prescriptorRecipeDate: string | null
  medicalProfessionalCouncil: IMedicalProfessionalCouncil
}

export interface IPagination {
  page: number,
  itemsPerPage: number,
  totalItems: number,
  totalPages: number
}

export interface IAuthenticateToken {
  accessToken: string
  refreshToken: string
  expires: string
}

export interface IEpharmaError {
  code: number
  message: string
}

export interface IAlloWedValues {
  id: number
  label: string
  value: string | number | any
}

export interface IAuthenticateUser {
  id: number,
  login: string,
  password: string | null,
  mobilePhoneNumber: string | null,
  email: string | null,
  cpf: string | null,
  name: string,
  lastName: string | null,
  startDate: Date,
  endDate: Date,
  pingDate: Date,
  gender: string,
  birthDate: string,
  status: number,
  type: number,
  requireNewPassword: boolean,
  phoneNumber: string,
  rg: string,
  addressLine: string,
  addressZipCode: string,
  addressNeighborhood: string,
  addressComplement: string,
  addressCity: string,
  addressState: string,
  loginAttemptsNumber: number,
  allowMultipleTokens: boolean,
  expiresTokenInHours: number,
  expiresRefreshTokenInHours: number,
  systems: any[]
}

export interface AuthenticateData {
  user: IAuthenticateUser
  token: IAuthenticateToken
}

export interface IIndustryAssociatedClient {
  id: number,
  name: string,
  authenticationDocument: number
}

export interface IBenefitProducts {
  name: string,
  presentation: string,
  ean: string,
  maximumPrice: number,
  salePrice: number,
  discountPercent: number,
  replacementIndustryPrice: number,
  replacementPurchasePrice: number,
  replacementIndustryDiscount: number,
  commercialGradeId: number,
  commercialGrade: string,
  calculationRuleTypeId: number,
  calculationRuleType: number
}

export interface IBenefit {
  id: number,
  name: string,
  siteUrl: string | null,
  phone: string | null,
  allowCustomMembership: boolean,
  allowCustomMembershipPDV: boolean,
  requiresMembership: boolean,
  client: IIndustryAssociatedClient,
  products: IBenefitProducts[]
}

export interface RegisterDefaultField {
  tableId: number
  columnId: number
  label: string
  apiAlias: string
  defaultValue: string | number | null
  order: number
  isActive: boolean
  type: string
  isAvaiableOnCreate: boolean
  isRequiredOnCreate: boolean
  isAvaiableOnUpdate: boolean
  isRequiredOnUpdate: boolean
  allowedValues: IAlloWedValues[]
}
export interface RegisterField {
  tableId: number,
  label: string,
  columnId: number,
  apiAlias: string,
  mask?: string
  type: IEpharmaFieldsType
  allowedValues: null | IAlloWedValues[]
}

export interface RegisterQuestionsFields {
  id: number,
  title: string,
  questionType: 'Checkbox' | 'RadioButton' | 'Texto' | 'Lista',
  maximumAnswerLength: number,
  order: number,
  isRequired: boolean,
  questionAlias: string,
  allowedValues: IAlloWedValues[]
}

export interface RegisterQuiz {
  id: number
  configurationId: number
  name: string
  drugs: any[]
  questions: RegisterQuestionsFields[]
}

export interface IBeneficiary {
  id: number
  name: string
  hasDependents: boolean
  dependents: any[]
  cardholderNumber: string
  benefit: Record<string, any>
  client: Record<string, any>
}

export interface IStoredDoctorInfoData {
  doctorUf: string
  recipeDate: string
  doctorRegister: number
  registerType: IMedicalProfessionalCouncil
}



export interface IBenefitProductsResponseData {
  benefit: IBenefit
}

export interface IBeneficiaryMemberElegibilityData {
  membership: boolean,
  product: boolean
}

export interface ResponseBeneficiaryRegisterConfigFields {
  quiz: RegisterQuiz[]
  fields: RegisterField[]
  defaultQuiz: RegisterQuiz[]
  defaultFields: RegisterDefaultField[]
}

