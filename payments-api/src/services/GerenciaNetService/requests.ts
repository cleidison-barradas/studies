import { Agent } from 'https'
import axios from 'axios'
import getCertificateFromS3 from '../getFileFromS3'
import { IGetPixQRCodeRequest, IOAuthRequest, IOAuthResponse, IRegisterCallbackRequest, IRequestPixCreateBilling } from './interfaces'

const { GERENCIANET_PIX_URL } = process.env
const { GERENCIANET_PARTNER_TOKEN } = process.env

const api = axios.create({
  baseURL: GERENCIANET_PIX_URL,
})

export const GetAgent = async (CertificateKey: string) => {
  const pfx = await getCertificateFromS3(CertificateKey)

  const httpsAgent = new Agent({
    pfx,
    passphrase: '',
  })

  return httpsAgent
}

export const OAuth = async (payload: IOAuthRequest) => {
  const { credentials, httpsAgent } = payload
  const { client_id, client_secret, partner_token } = credentials

  const Authorization = `Basic ${Buffer.from(`${client_id}:${client_secret}:${partner_token}`).toString('base64')}`

  const headers = {
    Authorization,
    'partner-token': partner_token,
    'Content-Type': 'application/json',
  }

  const data = JSON.stringify({ grant_type: 'client_credentials' })

  return api.post<IOAuthResponse>('/oauth/token', data, { headers, httpsAgent })
}

interface CreatePixBillingResponse {
  calendario: {
    criacao: Date
    expiracao: number
  }
  txid: string
  revisao: number
  loc: {
    id: number
    location: string
    tipoCob: string
    criacao: Date
  }
  location: string
  status: string
  devedor: {
    cpf: string
    nome: string
  }
  valor: {
    original: string
  }
  chave: string
  infoAdicionais: any[]
}

export const CreatePixBilling = async (payload: IRequestPixCreateBilling) => {
  const { data, access_token, httpsAgent } = payload

  const headers = {
    Authorization: `Bearer ${access_token}`,
    'partner-token': GERENCIANET_PARTNER_TOKEN,
    'Content-Type': 'application/json',
  }

  return api.post<CreatePixBillingResponse>(`/v2/cob`, data, { headers, httpsAgent })
}

interface GenerateQRCodeResponse {
  qrcode: string
  imagemQrcode: string
}

export const GetPixQRCode = async (payload: IGetPixQRCodeRequest) => {
  const { loc_id, httpsAgent, access_token } = payload

  const headers = {
    Authorization: `Bearer ${access_token}`,
    'partner-token': GERENCIANET_PARTNER_TOKEN,
    'Content-Type': 'application/json',
  }

  return api.get<GenerateQRCodeResponse>(`/v2/loc/${loc_id}/qrcode`, { headers, httpsAgent })
}
