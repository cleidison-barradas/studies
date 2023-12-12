/* eslint-disable @typescript-eslint/no-unused-vars */
import { JsonController, Res, Get, QueryParams, Post, Body, Put, Delete, Param, Product, ProductRepository, ProductControlRepository, ORM } from '@mypharma/api-core'
import { QueuePlugin } from '../../helpers/queue'
import { Response } from 'express'
import { IGetProductRequest, IPostProductRequest, IPostUpdateStoreProductsControlRequest } from './interfaces/product.request'
import ProductService from './product.service'
import ProductUpdateService from './services/ProductUpdateService'
import { StoreAdminProductsWithControl } from '../../utils/StoreAdminProductsWithControl'
import { ObjectId } from 'bson'

const productUpdateService = new ProductUpdateService()

@JsonController('/v1/product')
export default class ProductController {
  @Get('/')
  async getProducts(@Res() response: Response, @QueryParams() query: IGetProductRequest): Promise<unknown> {

    try {
      const productService = new ProductService()
      const { data, totalPages, page, limit } = await productService.getProducts(query)

      return response.json({
        products: data,
        limit,
        currentPage: page,
        total: totalPages
      })


    } catch (error) {
      console.log(error)
      return response.status(500).json({ error })
    }
  }

  @Post('/')
  async createProduct(@Res() response: Response, @Body() body: IPostProductRequest): Promise<unknown> {
    try {
      const productService = new ProductService()
      const product = await productService.createProduct(body)

      return { product }
    } catch (error) {
      console.log(error)
      return response.status(500).json({ error })
    }
  }

  @Put('/')
  async updateProduct(@Res() response: Response, @Body() body: IPostProductRequest): Promise<unknown> {
    try {
      const invalidate: string[] = []
      let { product } = body

      product = await productUpdateService.productUpdate({ product })

      invalidate.push(product.EAN)

      await QueuePlugin.publish('sync-product-change', { invalidate })

      return response.json({
        product,
      })

    } catch (error) {
      console.log(error)
      return response.status(500).json({ error: error.message })
    }
  }

  @Put('/storeUpdateControls')
  async updateStoreProductsControl(@Res() response: Response, @Body() body: IPostUpdateStoreProductsControlRequest): Promise<unknown> {
    try {
      const { tenant = '' } = body

      if (tenant.length === 0) {
        const error = 'EAN not provided'
        console.log(error)
        return response.status(500).json({ error: error })
      }

      const storeControls = await ProductControlRepository.repo()


      await ORM.setup(null, tenant)

      const storeProducts = await ProductRepository.repo(tenant)

      for await (const storeAdminProduct of StoreAdminProductsWithControl) {
        try {
          const products = await storeProducts.find({
            where: {
              EAN: storeAdminProduct.EAN,
              control: { $eq: null },
            },
          })

          if (products && products.length > 0) {
            const productControl = await storeControls.findOne({
              where: { initials: storeAdminProduct.control.initials },
            })

            if (productControl) {
              for await (let storeProduct of products) {
                storeProduct.control = productControl

                const productAndStoreToUpdate = {product: storeProduct, tenant: tenant }
                const updatedProduct = await productUpdateService.storeProductUpdate(productAndStoreToUpdate)
              }
            }
          }
        } catch (error) {
          console.log(error)
          return response.status(500).json({ error: error.message })
        }
      }

      return response.json({
        success: true,
      })
    } catch (error) {
      console.log(error)
      return response.status(500).json({ error: error.message })
    }
  }

  @Delete('/:id')
  async softDeleteProduct(@Res() response: Response, @Param('id') id: string): Promise<unknown> {
    try {
      const productService = new ProductService()
      await productService.softDelete(id)
      return { deletedId: id }
    } catch (error) {
      return response.status(500).json({ error })
    }
  }

  @Get('/:id')
  async getProduct(@Res() response: Response, @Param('id') id: string): Promise<unknown> {
    try {
      const productService = new ProductService()
      const product = await productService.getProductDetail(id)
      return { product }
    } catch (error) {
      return response.status(500).json({ error })
    }
  }
}
