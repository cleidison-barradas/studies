
/**
 * 1 - Loja física;
 * 2 - APP;
 * 3 - Site;
 * 4 - Televendas;
 * 5 - Whatsapp
 */
export type ITypeorigintransaction = 1 | 2 | 3 | 4 | 5

/**
  * 1 - CRM;
  * 2 - CRO
*/
export type IMedicalProfessionalCouncil = 1 | 2

export type IEpharmaFieldsType = 'text' | 'select' | 'checkbox'

interface IPagination {
  page: number
  itemsPerPage: number
  totalItems: number
  totalPages: number
}

interface IAuthenticateToken {
  accessToken: string
  refreshToken: string
  expires: string
}

export interface IPrescriptorData extends IPrescriptor {
  prescriptorName: string
  prescriptorRecipeDate: string
}

export interface IEpharmaError {
  code: number
  message: string
}

export interface IEpharmaAuthorizationDataKeys {
  authorizationId: number
  elegibilityToken: string
  expirationDate: string | Date
}

export interface IEpharmaRegisterFields {
  tableId: number,
  label: string,
  columnId: number,
  apiAlias: string,
  mask?: string
  type: IEpharmaFieldsType
  allowedValues: null | IAllowedValues[]
}
export interface IEpharmaRegisterQuiz {
  id: number,
  title: string,
  mask?: string
  label: string,
  apiAlias: string,
  questionAlias: string,
  type: IEpharmaFieldsType
  allowedValues: null | IAllowedValues[]
}

export interface IEpharmaFieldsNeedMask {
  name: string,
  mask?: string,
  type: IEpharmaFieldsType
}
export interface IEpharmaQuestionsNeedMask {
  name: string,
  mask?: string,
  type: IEpharmaFieldsType
}

interface IAuthenticateUser {
  id: number
  login: string
  password: string | null
  mobilePhoneNumber: string | null
  email: string | null
  cpf: string | null
  name: string
  lastName: string | null
  startDate: Date
  endDate: Date
  pingDate: Date
  gender: string
  birthDate: string
  status: number
  type: number
  requireNewPassword: boolean
  phoneNumber: string
  rg: string
  addressLine: string
  addressZipCode: string
  addressNeighborhood: string
  addressComplement: string
  addressCity: string
  addressState: string
  loginAttemptsNumber: number
  allowMultipleTokens: boolean
  expiresTokenInHours: number
  expiresRefreshTokenInHours: number
  systems: any[]
}

interface AuthenticateData {
  user: IAuthenticateUser
  token: IAuthenticateToken
}

interface IIndustryAssociatedClient {
  id: number
  name: string
  authenticationDocument: number
}

export interface IBenefitProducts {
  name: string
  presentation: string
  ean: string
  maximumPrice: number
  salePrice: number
  discountPercent: number
  replacementIndustryPrice: number
  replacementPurchasePrice: number
  replacementIndustryDiscount: number
  commercialGradeId: number
  commercialGrade: string
  calculationRuleTypeId: number
  calculationRuleType: number
}

export interface IBenefit {
  id: number
  name: string
  siteUrl: string | null
  phone: string | null
  allowCustomMembership: boolean
  allowCustomMembershipPDV: boolean
  requiresMembership: boolean
  client: IIndustryAssociatedClient
  products: IBenefitProducts[]
}

export interface IAllowedValues {
  id: number
  value: string
  label: string
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
  allowedValues: null | IAllowedValues[]
}

export interface RegisterQuestionsFields {
  id: number,
  title: string,
  questionType: 'Checkbox' | 'RadioButton' | 'Texto' | 'Lista',
  maximumAnswerLength: number,
  order: number,
  isRequired: boolean,
  questionAlias: string,
  allowedValues: null | IAllowedValues[]
}

interface IDrugsQuiz {
  id: number,
  name: string,
  sku: string,
  skuId: number,
  ean: string
}

export interface RegisterQuiz {
  id: number
  configurationId: number
  name: string
  drugs: IDrugsQuiz[]
  questions: RegisterQuestionsFields[]
}

interface IFieldsRequest {
  columnId: number,
  tableId: number,
  value: string
}

interface RequestQuestions {
  id: number
  value: string
}

export interface RequestRegisterMemberQuiz {
  id: number,
  skuId: number[]
  configurationId: number,
  questions: RequestQuestions[]
}

interface IBeneficiary {
  id: number
  name: string
  hasDependents: boolean
  dependents: any[]
  cardholderNumber: string
  benefit: Record<string, any>
  client: Record<string, any>
}

interface BeneficiaryData {
  beneficiary: IBeneficiary
  token: string
  tokenExpirationDate: string
}

interface IBenefitProductsResponseData {
  benefit: IBenefit
}

interface IBeneficiaryMemberElegibilityData {
  membership: boolean
  product: boolean
}

interface BeneficiaryRegisterConfigFields {
  fields: RegisterDefaultField[]
  quiz: RegisterQuiz[]
}


interface BasicEpharmaRequest {
  accessToken: string
}

export interface AuthorizedTransactionItems {
  ean: string,
  salePrice: number,
  categoryId: number,
  productName: string,
  factoryPrice: number,
  approvedQuantity: number
  storeMaximumPrice: number,
  retailTransferValue: number,
  unitAcquisitionPrice: number,
  rejectionReason: string,
}

interface AuthorizeTransaction {
  beneficiaryIdentifier: string,
  prescriptionScanning: number,
  authorizationId: number,
  expirationDate: Date,
  items: AuthorizedTransactionItems[],
  beneficiaries: string[],
  paymentMethods: any[],
  code: number,
  storeId: number,
  storeSequenceId: number
}

export interface TransactionItems {
  ean: string,
  quantity: number,
  salePrice: number,
  categoryId: number,
  storePrice: number,
  productName: string
  storeMaximumPrice: number,
}

interface IPrescriptor {
  prescriptorId: number
  prescritorState: string
  medicalProfessionalCouncil: IMedicalProfessionalCouncil
}

interface IPrescription {
  date: Date
  prescriptor: IPrescriptor
}

interface BasicEpharmaResponse {
  sucess: boolean
  pagination: IPagination | null
  messages: string | null
  error: IEpharmaError | null
}

export interface RequestRegisterMemberFields {
  columnId: number,
  tableId: number,
  value: string
}

export interface RequestAuthenticateService {
  storeId: string
}
export interface RequestIndustryAssociatedProducts extends BasicEpharmaRequest {
  ean?: string
}

export interface RequestBeneficiaryMemberElegibility extends BasicEpharmaRequest {
  ean: string
  benefitId: number
  identifyCustomer: string
}
export interface RequestBeneficiaryRegisterConfig extends BasicEpharmaRequest {
  benefitId: number
  eans: string[]
}

export interface RequestBeneficiaryElegibility extends BasicEpharmaRequest {
  clientId: number
  fingerprint: string
  beneficiaryId: string
}

export interface RequestBeneficiaryRegister extends BasicEpharmaRequest {
  benefitId: number
  fields: IFieldsRequest[]
  quiz: RequestRegisterMemberQuiz[]
}

export interface RequestAuthorizeTransaction extends BasicEpharmaRequest {
  elegibilityToken: string
  storeSequenceId: number,
  items: TransactionItems[],
  prescription: IPrescription
  typeorigintransaction?: ITypeorigintransaction,
}

export interface IAuthenticateResponse extends BasicEpharmaResponse {
  data: AuthenticateData
}

export interface IBenefitProductsResponse extends BasicEpharmaResponse {
  data: IBenefitProductsResponseData[]
}

export interface IBeneficiaryMemberElegibilityResponse extends BasicEpharmaResponse {
  data: IBeneficiaryMemberElegibilityData
}

export interface ResponseBeneficiaryRegisterConfig extends BasicEpharmaResponse {
  data: BeneficiaryRegisterConfigFields
}

export interface ResponseBeneficiaryElegibility extends BasicEpharmaResponse {
  data: BeneficiaryData
}

export interface ResponseBeneficiaryRegister extends BasicEpharmaResponse {
  data: any
}

export interface ResponseAuthorizeTransaction extends BasicEpharmaResponse {
  data: AuthorizeTransaction
}


