import {
  ORM,
  Product,
  Category,
  FileRepository,
  StoreRepository,
  ProductRepository,
  CategoryRepository,
  ShowcaseRepository,
  ManufacturerRepository,
  ProductControlRepository,
  ProductClassificationRepository,
} from "@mypharma/api-core";
import { ObjectId } from "bson";
import { GenericCache } from "../../product/helpers/genericCache";
import { QueuePlugin } from "../../../support/plugins/queue";

const processProduct = async (valids: Product[], replicas: Product[], tenant: string, mergebleFields: string[]) => {
  const bulkWriteProduct = []
  const bulkWriteShowCase = []
  const invalidate: any[] = []

  try {

    for await (let product of valids) {
      let image = undefined;
      let control = undefined;
      let category = undefined;
      let _category = undefined;
      let manufacturer = undefined;
      let classification = undefined;
      const extraUpdate: Record<any, any> = {}

      const replica = replicas.find(_replica => _replica.EAN === product.EAN)

      if (replica.control && replica.control.originalId) {

        if (!product.control) {
          control = await GenericCache(ProductControlRepository.repo(), tenant, replica.control.originalId)

          control = { ...control, _id: new ObjectId(control._id) }

        } else {

          if (replica.control.description !== product.control.description) {

            control = await GenericCache(ProductControlRepository.repo(), tenant, replica.control.originalId)

            control = { ...control, _id: new ObjectId(control._id) };
          }
        }
      }

      if (replica.classification && replica.classification.originalId) {
        if (!product.classification) {
          classification = await GenericCache(ProductClassificationRepository.repo(), tenant, replica.classification.originalId)

          classification = {
            ...classification,
            _id: new ObjectId(classification._id),
          }

        } else {
          if (product.classification.originalId && replica.classification.originalId !== product.classification.originalId) {
            classification = await GenericCache(
              ProductClassificationRepository.repo(),
              tenant,
              replica.classification.originalId
            );

            classification = {
              ...classification,
              _id: new ObjectId(classification._id),
            };
          }
        }
      }

      if (replica.manufacturer && replica.manufacturer.originalId) {
        delete replica.manufacturer._id

        if (!product.manufacturer) {

          manufacturer = await ManufacturerRepository.repo(tenant).createDoc({
            ...replica.manufacturer,
            _id: undefined,
            createdAt: new Date(),
          });

          manufacturer = {
            ...manufacturer,
            _id: new ObjectId(manufacturer._id),
          };

        } else {
          if (product.manufacturer.originalId && replica.manufacturer.originalId !== product.manufacturer.originalId) {
            manufacturer = await GenericCache(
              ManufacturerRepository.repo(tenant),
              tenant,
              replica.manufacturer.originalId
            );

            if (!manufacturer) {
              manufacturer = ManufacturerRepository.repo(tenant).createDoc({
                ...replica.manufacturer,
                _id: undefined,
                createdAt: new Date()
              });
            }

            manufacturer = {
              ...manufacturer,
              _id: new ObjectId(manufacturer._id),
            };
          }
        }
      }

      if (!!replica.image) {
        delete replica.image._id

        if (!product.image) {

          image = await FileRepository.repo(tenant).createDoc({
            ...replica.image,
            _id: undefined,
            createdAt: new Date()
          });

        } else {

          if (product.image.key !== replica.image.key) {
            image = await FileRepository.repo(tenant).createDoc({
              ...replica.image,
              _id: undefined,
              createdAt: new Date()
            });
          }
        }
      }

      if (replica.category && typeof replica.category !== 'undefined' && replica.category.length > 0) {
        category = []

        for await (const replica_category of replica.category) {
          _category = null

          if (replica_category.originalId && replica_category.originalId !== 0) {
            _category = await GenericCache(CategoryRepository.repo(tenant), tenant, replica_category.originalId)

            // create category if the store doesn't have it
            if (!_category) {
              delete replica_category._id

              _category = await CategoryRepository.repo(tenant).createDoc({
                ...replica_category,
                _id: undefined,
                subCategories: [],
                createdAt: new Date()
              })
            }

            if (!product.category || product.category.length <= 0) {

              _category._id = new ObjectId(_category._id)

              category.push(_category)

            } else {

              category = Array.from(product.category)

              const hasStored = category.find(x => x.originalId === replica_category.originalId)

              if (!hasStored) category.push(_category)
            }

            category.map(_cat => {
              _cat._id = new ObjectId(_cat._id)

              return _cat
            })
          }
        }
      }

      Object.keys(replica).forEach((key) => {
        if (typeof product[key] !== 'object' && key !== '_id' && !mergebleFields.includes(key)) {
          product[key] = replica[key]
          extraUpdate[key] = replica[key]
        }
      })

      product.image = image;
      product.status = true;
      product.control = control;
      product.category = category;
      product.manufacturer = manufacturer;
      product.classification = classification;

      Object.keys(product).forEach(_key => {
        if (product[_key] === undefined || _key.includes('_id')) delete product[_key]
      })

      bulkWriteProduct.push({
        updateOne: {
          filter: { EAN: product.EAN },
          update: {
            '$set': {
              ...product,
              updatedBy: "support",
              updatedAt: new Date(),
            },
          },
        },
      });

      let fields = {};
      Object.keys(product).forEach((key) => {
        fields = {
          ...fields,
          [`products.$.product.${key}`]: product[key],
        };
      });

      bulkWriteShowCase.push({
        updateMany: {
          filter: {
            products: {
              $elemMatch: {
                "product.EAN": product.EAN,
              },
            },
          },
          update: {
            $set: {
              ...fields,
              "products.$.product.updatedBy": "support",
              "prodcuts.$.product.updatedAt": new Date(),
            },
          },
        },
      });

      invalidate.push({
        tenant,
        ean: product.EAN
      })

      product = null
    }

    if (bulkWriteProduct.length > 0) {
      if (bulkWriteShowCase.length > 0) await ShowcaseRepository.repo(tenant).bulkWrite(bulkWriteShowCase)

      const { modifiedCount } = await ProductRepository.repo(tenant).bulkWrite(bulkWriteProduct)

      return {
        modifiedCount,
        invalidate
      }
    }

    return {
      invalidate: [],
      modifiedCount: 0

    }

  } catch (error) {
    console.log(error)

    return {
      invalidate: [],
      modifiedCount: 0
    }
  }
}

const productsFilter = async (eans: string[] = [], tenant: string) => {
  if (eans.length <= 0) return { valids: [], replicas: [] }

  const valids = await ProductRepository.repo(tenant).find({
    where: {
      EAN: {
        $in: eans
      },
      updatedBy: { $ne: 'store' }
    }
  })

  const replicas = await ProductRepository.repo().find({
    where: {
      EAN: {
        $in: eans
      }
    },
    select: [
      'EAN',
      'name',
      'image',
      'control',
      'category',
      'description',
      'manufacturer',
      'presentation',
      'classification',
      'activePrinciple',
    ]
  })

  return {
    valids,
    replicas
  }
}

export const handleEntries = async (tenants: string[] = [], entries: string[] = []) => {
  const processed: string[] = []

  for await (const tenant of tenants) {
    try {
      await ORM.setup(null, tenant)

      const store = await StoreRepository.repo().findOne({ where: { tenant }, select: ['settings'] })

      const mergebleFields = Array<string>(store.settings['etlMergeableFields'] || [])

      const { valids, replicas } = await productsFilter(entries, tenant)

      do {

        const processingValids = valids.splice(0, 1000)

        const { modifiedCount = 0, invalidate = [] } = await processProduct(processingValids, replicas, tenant, mergebleFields)

        processed.push(tenant)

        if (invalidate.length > 0) await QueuePlugin.publish('mongo-invalidate-product', invalidate)

        console.log(`sync ${modifiedCount} products on ${tenant}`)

      } while (valids.length > 0)

    } catch (error) {
      console.log(error)
    }
  }

  return processed
}