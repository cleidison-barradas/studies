import { CategoryRepository, ProductRepository } from '@mypharma/api-core'
import { ObjectId } from 'bson'
import { ICategoryProductFilter } from '../../category/interfaces'

interface RequestProductGetByCategoryServiceDTO {
  tenant: string
  limit: number
  filter: ICategoryProductFilter
  categoryId?: string
  manufacturers: string[]
}

class ProductGetByCategoryService {
  constructor(private repository?: any) { }

  public async getProductByCategory({ tenant, categoryId, filter = 'asc', limit = 20, manufacturers = [] }: RequestProductGetByCategoryServiceDTO) {
    const where: Record<string, any> = {}
    const order: Record<string, any> = {}

    if (!this.repository) {
      if (categoryId) {
        const _id = new ObjectId(categoryId)

        where['category'] = {
          $elemMatch: {
            $or: [{ _id }, { _id: categoryId }],
          },
        }

        where['$and'] = [
          {
            $or: [{ deletedAt: null }, { deletedAt: undefined }],
          },
          {
            $or: [{ deleted: false }, { deleted: null }, { deleted: undefined }],
          },
        ]

        where['status'] = true

        const category = await CategoryRepository.repo(tenant).findOne({ where: { _id, parentId: '0' } })

        if (category) {
          const subCategories =
            category.subCategories && category.subCategories.length > 0 ? category.subCategories.map((subCategory) => new ObjectId(subCategory._id.toString())) : []

          if (subCategories.length > 0) {
            where['category'] = {
              $elemMatch: {
                $or: [{ _id }, { _id: categoryId }, { _id: { $in: subCategories } }],
              },
            }
          }
        }
      }

      if (filter === 'asc') order['quantity'] = -1

      if (filter === 'price') {
        order['price'] = 1
        where['quantity'] = { $gt: 0 }
      }

      if (filter === 'promotion') {
        where['specials'] = {
          $ne: [],
        }

        where['specials.date_start'] = { $lt: new Date() }

        where['$or'] = [
          {
            'specials.date_end': { $gt: new Date() },
          },
          {
            'specials.date_end': null,
          },
        ]
      }

      if (manufacturers && manufacturers.length > 0) {
        order['quantity'] = -1

        where['$or'] = [
          { 'manufacturer._id': { $in: manufacturers.map((value) => new ObjectId(value)) } },
          { 'manufacturer._id': { $in: manufacturers } },
        ]
      }
    }

    const withDeleted = false
    const count = await ProductRepository.repo(tenant).count(where)
    const products = await ProductRepository.repo(tenant).findByCategory({ where, order, take: limit, withDeleted })

    return { products, count }
  }
}

export default ProductGetByCategoryService
