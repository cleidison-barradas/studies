import { CartProductRequest } from '@mypharma/api-core'


export const verifyVirtualProducts = (cartProducts: CartProductRequest[]) => {
  let onlyVirtualProducts = true
  let hasVirtualProducts = false
    
  for(const p of cartProducts){
    if(p.product.updateOrigin === 'Docas') hasVirtualProducts = true
    if(p.product.updateOrigin !== 'Docas') onlyVirtualProducts = false
  }

  if(onlyVirtualProducts) hasVirtualProducts = false

  return { onlyVirtualProducts, hasVirtualProducts }
}
