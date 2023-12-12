import { siteApi } from '../../config/api'
import { GetCupomResponse } from './response.service'

export async function getCupom(code: string, cartFingerprint: string | null) {
  return siteApi.get<GetCupomResponse>('/cupom', { cart: cartFingerprint, code })
}
