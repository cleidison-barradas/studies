/* eslint-disable @typescript-eslint/no-unused-vars */
import { ApiRequest, Get, Req, Controller, UseBefore, CustomerTenancyMiddleware, Res, QueryParam, Params, Product } from '@mypharma/api-core'
import { getRelatedPoductsService, GetMostPurchased, GetProductByEan } from './product.service'
import { Response } from 'express'
import { pmc } from '../../../services/pmc'
import { LoadStoreByID } from '../cart/cart.service'
import { ObjectId } from 'bson'

import ProductGetBySlugService from './services/ProductGetBySlugService'
import StoreGetByStoreIdService from '../store/services/StoreGetByStoreIdService'
import axios from 'axios'
import VirtualProductGetBySlugService from './services/VirtualProductGetBySlug'

const productGetBySlugService = new ProductGetBySlugService()
const storeGetByStoreIdService = new StoreGetByStoreIdService()
const virtualProductGetBySlugService = new VirtualProductGetBySlugService()

@Controller('/v2/product')
@UseBefore(CustomerTenancyMiddleware)
export class ProductController {
  @Get('/')
  public async getBySlug(
    @Res() response: Response, 
    @Req() request: ApiRequest, 
    @QueryParam('slug', { required: true }) slugQuery: string,
    @QueryParam('v', { required: false }) isVirtual: number) {
    const { tenant, session: { store: storeId } } = request

    const slug = slugQuery.replace(/\s/g, '')

    let product = new Product()
    try {

      if(isVirtual === 1) {
        const store = await storeGetByStoreIdService.getStoreByStoreId({ storeId })

        if (!slug || slug.length <= 0) {

          throw new Error('slug_not_provided')
        }

        const res = await virtualProductGetBySlugService.getProductBySlug({ tenant, slug })
        product = pmc(res, store)
        
      } else {
        const store = await storeGetByStoreIdService.getStoreByStoreId({ storeId })

        if (!slug || slug.length <= 0) {

          throw new Error('slug_not_provided')
        }

        const res = await productGetBySlugService.getProductBySlug({ tenant, slug })
        product = pmc(res, store)
        
      }
      return response.json({
        product
      })

    } catch (error) {
      console.log(error)
      return response.status(500).json({
        product: null
      })
    }
  }

  @Get('/related')
  public async getRelatedProducts(@Res() response: Response, @Req() request: ApiRequest, @QueryParam('ean') ean: string) {
    try {
      const store = await LoadStoreByID(new ObjectId(request.session.store) as any)
      const products = await getRelatedPoductsService(request.tenant, ean).then((value) => value.map((product) => pmc(product, store)))

      return { products }
    } catch (error) {
      console.log(error)
      return response.status(500).json({
        error: 'internal_server_error',
      })
    }
  }

  @Get('/most/purchased')
  public async GetMostProductsPurchased(@Res() response: Response, @Req() request: ApiRequest) {

    try {
      const { tenant } = request
      const result = await GetMostPurchased(tenant)

      const eans = result.map(r => r._id)

      const products = await GetProductByEan(tenant, eans)

      return response.send({ products })

    } catch (error) {
      console.log(error)
      return response.status(500).json({
        error: 'internal_server_error'
      })
    }
  }
}
