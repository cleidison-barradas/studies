/* eslint-disable @typescript-eslint/indent */
import { ApiRequest, BodyParam, Category, CustomerTenancyMiddleware, Get, JsonController, Param, Post, QueryParam, Req, Res, UseBefore } from '@mypharma/api-core'
import { ObjectId } from 'bson'
import { Response } from 'express'
import applyMetaVars from '../../../helpers/applyMetaVars'
import { pmc } from '../../../services/pmc'
import { getStore } from '../../../support/services/StoreService'
import { LoadStoreByID } from '../cart/cart.service'
import { getCategory, getCategoryManufacturers, getProductsByCategoryID } from './category.service'
import { ICategoryProductFilter } from './interfaces'

import ProductGetByCategoryService from '../product/services/ProductGetByCategoryService'
import StoreGetByStoreIdService from '../store/services/StoreGetByStoreIdService'

const storeGetByStoreIdService = new StoreGetByStoreIdService()
const productGetByCategoryService = new ProductGetByCategoryService()

@JsonController('/v2/category')
@UseBefore(CustomerTenancyMiddleware)
export class CategoryController {
  @Get('/')
  public async index(@Req() request: ApiRequest, @QueryParam('populated') populated: boolean, @Res() response: Response) {
    try {
      const { tenant, session } = request
      const { store } = session

      const categorys = await getCategory(tenant, populated)
      const Store = await getStore(store)

      return response.json({
        categorys: categorys.map((category: Category) => {
          const slug = category.name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9 ]/g, '')
            .replace(/\s+/g, ' ')
            .replace(/^\s+|\s+$/, '')
            .replace(/\s/g, '-')

          const { metaTitle, metaDescription } = applyMetaVars(category.metaTitle || '', category.metaDescription || '', {
            categoryName: category.name,
            storeCity: Store.settings['config_store_city'],
            storeName: Store.name,
          })

          const subCategories = category?.subCategories?.filter((subCategory) => subCategory.status === true)

          return {
            ...category,
            metaTitle,
            metaDescription,
            slug,
            subCategories: subCategories
              ?.sort(function (a, b) {
                if (a.name < b.name) {
                  return -1
                }

                if (a.name > b.name) {
                  return 1
                }
                return 0
              })
              .map((subCategory) => {
                const slug = subCategory.name
                  .toLowerCase()
                  .normalize('NFD')
                  .replace(/[\u0300-\u036f]/g, '')
                  .replace(/[^a-z0-9 ]/g, '')
                  .replace(/\s+/g, ' ')
                  .replace(/^\s+|\s+$/, '')
                  .replace(/\s/g, '-')

                const { metaTitle, metaDescription } = applyMetaVars(subCategory.metaTitle || '', subCategory.metaDescription || '', {
                  categoryName: subCategory.name,
                  storeCity: Store.settings['config_store_city'],
                  parentName: Store.name,
                  storeName: Store.name,
                })

                return {
                  ...subCategory,
                  metaTitle,
                  metaDescription,
                  slug,
                }
              }),
          }
        }),
      })
    } catch (error) {
      console.log(error)
      return response.status(500).json({
        categorys: [],
      })
    }
  }

  @Get('/products/:categoryId')
  public async getProductsByCategoryName(
    @Req() request: ApiRequest,
    @Res() response: Response,
    @Param('categoryId') categoryId: string,
    @QueryParam('limit') limit = 20,
    @QueryParam('manufacturers') manufacturers: string[],
    @QueryParam('filter') filter: ICategoryProductFilter
  ) {
    try {
      const { tenant, session } = request
      const storeId = session.store

      const store = await storeGetByStoreIdService.getStoreByStoreId({ storeId })

      const { products, count } = await productGetByCategoryService.getProductByCategory({ tenant, categoryId, filter, limit, manufacturers })
      if (products.length <= 0) {
        return response.json({
          count,
          products: [],
        })
      }

      const _products = products.map((product) => pmc(product, store))

      return response.json({
        count,
        products: _products,
      })
    } catch (error) {
      console.log(error)
      return response.status(500).json({
        count: 0,
        products: [],
      })
    }
  }

  @Get('/manufacturer/:id')
  public async getManufacturersByCategoryID(@Req() request: ApiRequest, @Res() response: Response, @Param('id') id: string) {
    try {
      const { tenant } = request
      const manufacturers = await getCategoryManufacturers(tenant, id)

      return response.json({
        manufacturers,
      })
    } catch (error) {
      console.log(error)
      return response.status(500).json({
        manufacturers: [],
      })
    }
  }

  @Post('/products')
  public async getProducts(@Req() request: ApiRequest, @Res() response: Response, @BodyParam('ids') id: string[], @QueryParam('limit') limit = 10) {
    try {
      const { tenant } = request
      const store = await LoadStoreByID(new ObjectId(request.session.store) as any)
      const products = await getProductsByCategoryID(tenant, id, limit).then((value) => value.map((product) => pmc(product, store)))

      return response.json({
        products,
      })
    } catch (error) {
      console.log(error)
      return response.status(500).json({
        products: [],
      })
    }
  }
}
