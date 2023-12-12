import { create } from 'apisauce'
const {
  REACT_APP_AUTH_API_URL,
  REACT_APP_SITE_API_URL,
  REACT_APP_PAYMENT_API_URL,
  REACT_APP_SEARCH_API_URL,
  REACT_APP_X_ORIGIN,
  REACT_APP_SHIPPING_API_URL,
  NODE_ENV,
} = process.env

const headers: any = {}

if (NODE_ENV === 'development') {
  headers['x-origin'] = REACT_APP_X_ORIGIN
}

export const authApi = create({
  baseURL: REACT_APP_AUTH_API_URL,
  headers,
})

export const siteApi = create({
  baseURL: REACT_APP_SITE_API_URL,
  headers,
})

export const searchApi = create({
  baseURL: REACT_APP_SEARCH_API_URL,
  headers,
})

export const paymentApi = create({
  baseURL: REACT_APP_PAYMENT_API_URL,
  headers,
})

export const shippingApi = create({
  baseURL: REACT_APP_SHIPPING_API_URL,
  headers,
})

export function setAccessToken(accessToken: string) {
  siteApi.setHeader('Authorization', `Bearer ${accessToken}`)
  authApi.setHeader('Authorization', `Bearer ${accessToken}`)
  paymentApi.setHeader('Authorization', `Bearer ${accessToken}`)
  searchApi.setHeader('Authorization', `Bearer ${accessToken}`)
  shippingApi.setHeader('Authorization', `Bearer ${accessToken}`)
}
