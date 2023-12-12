import { Product, ProductRepository, FileRepository, CategoryRepository } from '@mypharma/api-core'
import { IGetProductRequest, IPostProductRequest } from './interfaces/product.request'
import { DeleteWriteOpResultObject, ObjectLiteral } from 'typeorm'
import { ObjectId } from 'bson'
import * as crypto from 'crypto'
import { IUpload } from '../../services/interfaces/upload'
import { ImageCompress } from '../../utils/fileHelper'
import { put, remove } from '../../services/aws'
const { DATABASE_MASTER_NAME } = process.env

export default class ProductService {
  async getProducts({ name = '', page = 1, limit = 10, others, start, end, category }: IGetProductRequest) {
    let where: ObjectLiteral = { $or: [{ name: new RegExp(name, 'gi') }, { EAN: new RegExp(name, 'gi') }] }
    if (others) {
      if (others === 'nocategory') {
        if (category) {
          where['$or'] = [...where['$or'], { category: [] }, { category }]
        } else {
          where['$or'] = [...where['$or'], { category: [] }]
        }
      } else if (others === 'noimage') {
        where = { ...where, image: null }
      }
    } else if (category) {
      where['category'] = { $eq: category }
    }

    if (start && end) {
      where['createdAt'] = { $gte: new Date(start), $lte: new Date(end) }
    }

    return ProductRepository.repo(DATABASE_MASTER_NAME).paginate(where, { page, limit })
  }

  async countProducts({ name, others }: IGetProductRequest): Promise<number> {
    let query: ObjectLiteral = { $or: [{ name: new RegExp(name, 'gi') }, { EAN: new RegExp(name, 'gi') }] }
    if (others) {
      if (others === 'nocategory') {
        query = { ...query, category: [] }
      } else if (others === 'nostock') {
        query = { ...query, quantity: 0 }
      } else if (others === 'noimage') {
        query = { ...query, image: null }
      }
    }
    return ProductRepository.repo(DATABASE_MASTER_NAME).count(query)
  }

  async createProduct({ product }: IPostProductRequest): Promise<Product> {
    const image: IUpload | null = product.image as unknown as IUpload
    if (image) {
      const name = `${crypto.randomBytes(16).toString('hex')}-${product.image.name.replace(/\s/g, '')}`
      const path = `${DATABASE_MASTER_NAME}/product/${name}`
      image.content = await ImageCompress(image.content, 250)

      const { Location, Key } = await put(path, image)

      const file = await FileRepository.repo(DATABASE_MASTER_NAME).createDoc({
        name,
        key: Key,
        url: Location,
        folder: path,
      })
      product.image = file
      product.imageUrl = Location
    }
    product.createdAt = new Date()
    product.updatedAt = new Date()
    return ProductRepository.repo(DATABASE_MASTER_NAME).createDoc(product)
  }

  async softDelete(_id: string): Promise<DeleteWriteOpResultObject> {
    return ProductRepository.repo(DATABASE_MASTER_NAME).deleteOne({ _id: new ObjectId(_id) })
  }

  async getProductDetail(_id: string): Promise<Product> {
    return ProductRepository.repo(DATABASE_MASTER_NAME).findById(_id)
  }
  async getProductWithCategories(productId: string): Promise<Product> {
    const product = await ProductRepository.repo(DATABASE_MASTER_NAME).findById(productId)

    if (product) {
      const where = {}

      if (typeof product.category === 'string') {
        where['_id'] = new ObjectId(product.category)
      }

      if (product.category instanceof Array) {
        where['_id'] = { $in: product.category }
      }

      const categories = await CategoryRepository.repo(DATABASE_MASTER_NAME).find({
        where,
      })

      product.category = categories
    }
    return product
  }
}
