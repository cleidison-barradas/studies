import { Agent } from 'https'

export interface ICredentials {
  certificateKey: string
  client_id: string
  client_secret: string
  pix_key: string
  partner_token: string
}

export interface ICharge {
  cpf: string
  nome: string
  valor: string
  chave: string
}

export interface IOAuthResponse {
  access_token: string
  token_type: string
  expires_in: number
  scope: string
}

export interface IRequestCredentials {
  access_token: string
  httpsAgent: Agent
}

interface IInfoAdicional {
  nome: string
  valor: string
}

export interface IGeneratePixBillingRequest {
  cpf: string
  nome: string
  valor: string
  pedido_id: string
}

export interface IRequestPixCreateBillingPayload {
  calendario: {
    expiracao: number
  }
  devedor: {
    cpf: string
    nome: string
  }
  valor: {
    original: string
  }
  chave: string
  infoAdicionais?: IInfoAdicional[]
}

export interface IRequestPixCreateBilling extends IRequestCredentials {
  data: string
}

export interface IOAuthRequest extends Omit<IRequestCredentials, 'access_token'> {
  credentials: Omit<ICredentials, 'pix_key' | 'certificateKey'>
}

export interface IGetPixQRCodeRequest extends IRequestCredentials {
  loc_id: string
}

export interface IRegisterCallbackRequest extends IRequestCredentials {
  webhookUrl: string
  chave: string
}
