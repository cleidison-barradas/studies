import { ApiRequest, Get, Req, Controller, UseBefore, CustomerTenancyMiddleware, Param, Post, Res, logger, colors } from '@mypharma/api-core'
import { normalizeCategories } from '../../../../helpers/normalizeCategory'
import { getProductBySlug, getProductsByEAN, GetStorePMC } from '../services/ProductService'
import { getMainShowcase, getSmartShowcase, updateSmartShowcase } from '../services/ShowcaseService'
import { Response } from 'express'
import { pmc } from '../../../../services/pmc'

@Controller('/v1/product')
@UseBefore(CustomerTenancyMiddleware)
export class ProductController {
  @Post('/:productSlug')
  public async getBySlug(@Res() response: Response, @Req() request: ApiRequest, @Param('productSlug') productSlug: string) {
    try {
      const result = await getProductBySlug(request.tenant, productSlug)
      const store = await GetStorePMC(request.session.store)

      const product = {
        product_id: result._id,
        name: result.name,
        model: result.name,
        presentation: result.presentation,
        description: result.description,
        ean: result.EAN,
        ms: result.MS,
        active_principle: result.activePrinciple,
        image: result.image?.key,
        price: result.price,
        quantity: result.quantity,
        status: 1,
        categories: [],
        last_stock: result.updatedAt,
        manufacturer: null,
        classification: null,
        control: null,
        slug: result.slug.pop(),
        manualPMC: result.manualPMC,
        pmcPrice: result.pmcPrice,
        pmcValues: result.pmcValues,
        specials: [],
        erp_pmc: null,
      }

      // Normalize categories
      product.categories = normalizeCategories(result.category)

      if (result.manufacturer) {
        if (!result.manufacturer) {
          product.manufacturer = []
        }
        const manufacturers = []

        manufacturers.push({
          manufacturer_id: result.manufacturer?._id,
          name: result.manufacturer?.name,
        })

        product.manufacturer = manufacturers
      }

      if (result.classification) {
        if (!result.classification) {
          product.classification = []
        }
        const classifications = []

        classifications.push({
          classification_id: product.classification?._id,
          name: product.classification?.name,
        })

        product.classification = classifications
      }

      if (result.control) {
        if (!result.control) {
          product.control = []
        }

        product.control = {
          control_id: result.control?._id,
          description: result.control?.description,
          initials: result.control?.initials,
        }
      }

      if (result.specials) {
        product.specials = result.specials.map((s) => {
          return {
            store_id: request.session.store,
            ...s,
          }
        })
      }

      if (Number(result.erp_pmc) && Number(result.erp_pmc) > 0) {
        product.erp_pmc = Number(result.erp_pmc)
      }

      const { specials, price } = pmc(product as any, store)

      product.specials = specials
      product.price = price

      return { product }
    } catch (error) {
      console.log(error)
      return response.status(500).json({
        error: 'internal_server_error',
      })
    }
  }

  @Get('/feature')
  public async showcase(@Req() request: ApiRequest) {
    try {
      const showcase = await getMainShowcase(request.tenant)
      const store = await GetStorePMC(request.session.store)

      const products = []

      if (!showcase) {
        return { products }
      }

      showcase.products
        .filter(({ product }) => (showcase.smart ? product.quantity >= showcase.smartFilters.quantity : product.quantity >= 1))
        .map(({ product, position }: any, index: number) => {
          products.push({
            product_id: product._id,
            name: product.name,
            presentation: product.presentation,
            description: product.description,
            model: product.model,
            ean: product.EAN,
            ms: product.MS,
            active_principle: product.activePrinciple,
            image: product.image?.key,
            price: product.price,
            quantity: product.quantity,
            status: 1,
            position,
            categories: [],
            last_stock: product.updatedAt,
            manufacturer: null,
            classification: null,
            control: null,
            slug: product.slug.pop(),
            specials: [],
            erp_pmc: 0,
            pmcPrice: product.pmcPrice,
            pmcValues: product.pmcValues,
            manualPmc: product.manualPMC,
          })

          // Normalize categories
          product.categories = normalizeCategories(product.category)

          if (product.manufacturer) {
            if (!products[index].manufacturer) {
              products[index].manufacturer = []
            }

            products[index].manufacturer.push({
              manufacturer_id: product.manufacturer?._id,
              name: product.manufacturer?.name,
            })
          }

          if (product.classification) {
            if (!products[index].classification) {
              products[index].classification = []
            }

            products[index].classification.push({
              classification_id: product.classification?._id,
              name: product.classification?.name,
            })
          }

          if (product.control) {
            if (!products[index].control) {
              products[index].control = []
            }

            products[index].control = {
              control_id: product.control?._id,
              initials: product.control?.initials,
              description: product.control?.description,
            }
          }

          if (product.specials) {
            products[index].specials = product.specials.map((s) => {
              return {
                store_id: request.session.store,
                ...s,
              }
            })
          }

          if (product.erp_pmc && Number(product.erp_pmc) > 0) {
            products[index].erp_pmc = Number(product.erp_pmc)
          }

          products[index] = pmc(product, store)

        })

      const { smart } = showcase

      if (smart) {
        const {
          smartFilters: { quantity, control },
        } = showcase
        if (showcase.products.find(({ product }) => product.quantity < showcase.smartFilters.quantity)) {
          const newShowcase = await getSmartShowcase(request.session.store)

          const loadedProducts = (
            await getProductsByEAN(
              request.tenant,
              newShowcase.map(({ _id }) => String(_id)),
              quantity,
              control
            )
          ).map((product) => ({ position: null, product }))

          await updateSmartShowcase(request.tenant, loadedProducts)
        }
      }

      return { products }
    } catch (error) {
      logger(error.message, colors.FgRed)
      return { products: [] }
    }
  }
}
