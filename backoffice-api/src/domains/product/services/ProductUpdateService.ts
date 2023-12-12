/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ORM, Product, ProductClassificationRepository, ProductControlRepository, ProductRepository } from '@mypharma/api-core'
import { randomBytes } from 'crypto'
import { ObjectId } from 'bson'
import { IUpload } from '../../../services/interfaces/upload'

import ImageCreateService from '../../image/services/ImageCreateService'
import ImageGetByImageIdService from '../../image/services/ImageGetByImageIdService'
import { put, remove } from '../../../services/aws'
import { ImageCompress } from '../../../utils/fileHelper'

const imageCreateService = new ImageCreateService()
const imageGetByImageIdService = new ImageGetByImageIdService()

interface ProductUpdateServiceDTO {
  product: Product
}

interface StoreProductUpdateServiceDTO {
  product: Product
  tenant: string
}

class ProductUpdateService {
  constructor(private repository?: any) { }

  public async productUpdate({ product }: ProductUpdateServiceDTO): Promise<Product> {
    const image: IUpload | null = product.image as unknown as IUpload
    const _id = new ObjectId(product._id.toString())
    let productUpdated = new Product()

    delete product._id
    product.updatedBy = 'support'
    product.updatedAt = new Date()

    if (product.control && product.control.toString() !== '0') {
      const control = await ProductControlRepository.repo().findById(product.control)
      product.control = control || null
    } else {
      product.control = null
    }

    if (product.classification && product.classification.toString() !== '0') {
      const classification = await ProductClassificationRepository.repo().findById(product.classification)
      product.classification = classification || null
    } else {
      product.classification = null
    }

    if (!this.repository) {

      if (image && image.content) {
        if (product.image._id) {
          const imageId = product.image._id.toString()

          const imageExists = await imageGetByImageIdService.getImageByImageId({ imageId })

          if (imageExists) await remove(imageExists.key)
        }

        image.content = await ImageCompress(image.content, 250)

        const folder = 'products'
        const name = `${randomBytes(16).toString('hex')}-${product.image.name.replace(/\s/g, '')}`
        const path = `${folder}/${name}`

        const { Location: url, Key: key } = await put(path, image)

        product.image = await imageCreateService.imageCreate({ url, key, name, folder })
        product.imageUrl = url
      } else {
        product.image = null
        product.imageUrl = ''
      }

      await ProductRepository.repo().updateOne({ _id }, { $set: product })

      productUpdated = await ProductRepository.repo().findById(_id)
    }

    return productUpdated
  }

  public async storeProductUpdate({ product, tenant }: StoreProductUpdateServiceDTO): Promise<Product> {
    await ORM.setup(null, tenant)
    const _id = new ObjectId(product._id.toString())
    let productUpdated = new Product()

    const storeProductRepository = ProductRepository.repo(tenant)

    const storeProductId = new ObjectId(product._id.toString())
    delete product._id
    product.updatedBy = 'support'
    product.updatedAt = new Date()

    await storeProductRepository.updateOne({ _id: storeProductId }, { $set: product })
    productUpdated = await ProductRepository.repo().findById(_id)

    return productUpdated
  }

}

export default ProductUpdateService
