import { siteApi } from '../../config/api'
import Cart from '../../interfaces/cart'
import { LoadCartByFingerprintResponse, SaveCartResponse } from './response.interface'

export async function loadCartByFingerprint(fingerprint: string | null, customerId?: string) {

  return siteApi
    .get<LoadCartByFingerprintResponse>(`/v2/cart`, { fingerprint, customerId })
    .then((res) => res.data)
}

export async function saveCart(cart: Partial<Cart>, customerId?: string, fingerprint?: string | null) {

  return siteApi.put<SaveCartResponse>('/v2/cart', { cart }, { params: { customerId, fingerprint } }).then((res) => res.data)
}

