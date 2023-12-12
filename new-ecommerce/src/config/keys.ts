const { REACT_APP_IMAGES_CDN } = process.env

export const StorageKeys = {
  cart: '@mypharma/cart',
  user: '@mypharma/user',
  store: '@mypharma/store',
  search: 'search_history',
  redirect: '@mypharma/redirect',
  ecommerce_session: '@mypharma/ecommerce_session',
  pbm_session: '@mypharma/pbm_session',
}

export const CDN = {
  image: REACT_APP_IMAGES_CDN,
}
