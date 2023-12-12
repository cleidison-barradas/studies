import { CartProductRequest } from '@mypharma/api-core'
import ProductGetByIdsService from '../../product/services/ProductGetByIdsServices'
import GetPaymentLinkService from './GetPaymentLinkService'
import VirtualProductGetById from '../../product/services/VirtualProductGetById'

interface RequestSyncProductServiceDTO {
  tenant: string
  cartId?: string
  cartProducts: CartProductRequest[]
}

class CartSyncProductService {
  public async execute({ cartProducts, tenant, cartId = null }: RequestSyncProductServiceDTO) {

    const getProductByIds = new ProductGetByIdsService()
    const getVirtualProductByIds = new VirtualProductGetById()
    const getPaymentLinkService = new GetPaymentLinkService()

    const parsedProducts: CartProductRequest[] = []

    const phisycalProductIdsSet = new Set()
    const virtualProductIdsSet = new Set()

    if (cartProducts.length <= 0) return cartProducts

    for (const product of cartProducts) {
      if (product.product.updateOrigin === 'Docas') {
        virtualProductIdsSet.add(product.product._id.toString())
      } else {
        phisycalProductIdsSet.add(product.product._id.toString())
      }
    }

    const productIds = Array.from(phisycalProductIdsSet) as string[]
    const virtualProductIds = Array.from(virtualProductIdsSet) as string[]

    const storeProducts = await getProductByIds.execute({ productIds, tenant })
    const virtualProducts = virtualProductIds ? await getVirtualProductByIds.execute({ virtualProductIds, tenant }) : []

    const paymentLink = cartId ? await getPaymentLinkService.execute({ tenant, cartId }) : null

    if (cartProducts.length === phisycalProductIdsSet.size) {
      if (storeProducts.length < productIds.length) throw new Error('invalid_cart_products')
    } else {
      if (cartProducts.length < (productIds.length + virtualProductIds.length)) throw new Error('invalid_cart_products')
    }

    cartProducts.forEach(cartProduct => {
      const product =
        cartProduct.product.updateOrigin === 'Docas'
          ? virtualProducts.find((p) => p._id.toString() === cartProduct.product._id.toString())
          : storeProducts.find((p) => p._id.toString() === cartProduct.product._id.toString())

      if (product && product.status && product.quantity > 0 && !product.deletedAt) {

        const quantity = cartProduct.quantity

        if (paymentLink) {

          product.price = cartProduct.product.price
        }

        parsedProducts.push({
          product,
          quantity,
          origin: cartProduct.origin
        })
      }
    })
    return parsedProducts
  }
}

export default CartSyncProductService
