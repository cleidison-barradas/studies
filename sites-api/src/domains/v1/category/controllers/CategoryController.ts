import {
  Response,
  ApiRequest,
  Get,
  Req,
  UseBefore,
  JsonController,
  CustomerTenancyMiddleware,
  Category,
} from '@mypharma/api-core'
import applyMetaVars from '../../../../helpers/applyMetaVars'
import { getStore } from '../../../../support/services/StoreService'
import getCategory from '../services/CategoryService'

@JsonController('/v1/category')
@UseBefore(CustomerTenancyMiddleware)
export class AboutUsController {
  @Get('/')
  public async index(@Req() request: ApiRequest) {
    try {
      const { tenant, session } = request

      const { store } = session

      const rawCategories = await getCategory(tenant)

      const Store = await getStore(store)
 
      const categories = rawCategories.filter(c => c.parentId === '0').map((category: Category) => {
        const slug = category.name
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9 ]/g, '')
          .replace(/\s+/g, ' ')
          .replace(/^\s+|\s+$/, '')
          .replace(/\s/g, '-')

        const { metaTitle, metaDescription } = applyMetaVars(
          category.metaTitle || '',
          category.metaDescription || '',
          {
            categoryName: category.name,
            storeCity: Store.settings['config_store_city'],
            storeName: Store.name,
          }
        )

        return {
          category_id: category._id.toString(),
          image: category.image,
          name: category.name,
          description: category.description,
          parent_id: null,
          top: null,
          column: null,
          sort_order: null,
          meta_title: metaTitle,
          meta_description: metaDescription,
          meta_keywords: '',
          slug,
          status: category.status ? 1 : 0,
          subCategories: category.subCategories.map(subCategory => {
            const { _id, name, metaTitle: meta_title, metaDescription: meta_description, description, status, image } = subCategory

            const slug = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').replace(/^\s+|\s+$/, '').replace(/\s/g, '-')
            const { metaTitle, metaDescription } = applyMetaVars(meta_title || '', meta_description || '', {
              categoryName: name,
              storeCity: Store.settings['config_store_city'],
              parentName: Store.name,
              storeName: Store.name,
            })

            return {
              category_id: _id,
              name,
              slug,
              image,
              status: status ? 1 : 0,
              top: null,
              description,
              column: null,
              meta_title: metaTitle,
              meta_description: metaDescription,
              parent_id: null,
              sort_order: null,
              subCategories: []
            }
          }),
        }
      })

      return {
        categories,
      }
    } catch (error) {
      console.log(error)
      return Response.error(error.name, error.message)
    }
  }
}
