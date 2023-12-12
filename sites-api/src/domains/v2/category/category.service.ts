import { CategoryRepository, ManufacturerRepository, ProductRepository, RedisPlugin } from '@mypharma/api-core'
import { ObjectID, ObjectId } from 'bson'
import { ICategoryProductFilter } from './interfaces'

export async function getCategory(tenant: string, populated?: boolean) {
  if (!populated) {
    const cached = await RedisPlugin.get(`category:${tenant}`)

    if (cached) {
      return cached
    }
  }

  const options = {
    where: {
      status: true,
      parentId: '0',
    },
  }

  if (!populated) options['select'] = ['name', 'createdAt', 'image', 'parentId', 'position']

  const categorys = await CategoryRepository.repo<CategoryRepository>(tenant).find(options)

  if (!populated) RedisPlugin.setWithExpire(`category:${tenant}`, categorys, 60 * 10)

  return categorys
}

export function findByName(name: string, tenant: string) {
  return CategoryRepository.repo<CategoryRepository>(tenant).find({
    where: {
      status: true,
      name,
    },
  })
}

export function getProductsByCategoryID(tenant: string, category: string[], take: number) {
  return ProductRepository.repo(tenant).find({
    where: {
      'category._id': {
        $in: category.map((value) => new ObjectId(value)),
      },
      quantity: { $gt: 0 },
      'image.key': { $ne: [undefined, ''] },
    },
    take,
  })
}

export async function getProductsByCategoryName(tenant: string, categoryId: string, take: number, filter: ICategoryProductFilter, manufacturers: string[]) {
  const where: Record<string, any> = {}
  const order: Record<string, any> = {}

  if (categoryId) {
    const _id = new ObjectId(categoryId)

    where['category'] = {
      $elemMatch: { $or: [{ _id }, { _id: categoryId }] }
    }

    where['status'] = true

    const category = await CategoryRepository.repo(tenant).findOne({ where: { _id, parentId: '0' } })

    if (category) {
      const subCategories = category.subCategories && category.subCategories.length > 0 ? category.subCategories.map(subCategory => new ObjectId(subCategory._id.toString())) : []

      if (subCategories.length > 0) {
        where['category'] = {
          $elemMatch: {
            $or: [
              { _id },
              { _id: categoryId },
              { _id: { $in: subCategories } }
            ]
          }
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

  return ProductRepository.repo(tenant).findAndCount({
    where,
    order,
    take,
  })
}

export function countProductsByCategoryName(tenant: string, name: string, filter: 'asc' | 'price' | 'promotion', categoryName: string, manufacturers: string[]) {
  const where: any = {
    'category.name': categoryName,
    name: new RegExp(name, 'gi'),
    status: true,
  }

  const order = {}

  if (filter === 'asc') order['quantity'] = -1
  if (filter === 'price') {
    order['quantity'] = -1
    order['price'] = 1
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
    where['manufacturer._id'] = { $in: manufacturers.map((value) => new ObjectID(value)) }
  }

  return ProductRepository.repo(tenant).count(where)
}

export async function getCategoryManufacturers(tenant: string, id: string) {
  const query = await ProductRepository.repo(tenant)
    .aggregate([
      {
        $match: {
          'category._id': new ObjectID(id),
        },
      },
      {
        $group: {
          _id: '$manufacturer._id',
        },
      },
    ])
    .toArray()

  const ids = query.map((value) => new ObjectID(value._id))

  const manufacturers = await ManufacturerRepository.repo(tenant).find({ _id: { $in: ids } } as any)

  return manufacturers
}
