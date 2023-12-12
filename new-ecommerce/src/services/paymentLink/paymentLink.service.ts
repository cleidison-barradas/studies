import { siteApi } from '../../config/api'
import Cart from '../../interfaces/cart'
import { LoadPaymentLinkByFingerprintResponse } from './response.interface'

export function loadPaymentLinkByFingerprint(fingerprint: Cart['fingerprint']) {
  return siteApi
    .get<LoadPaymentLinkByFingerprintResponse>(`/v2/link/${fingerprint}`)
    .then((res) => res.data)
}
