// Sentry
const Sentry = require('@sentry/node')
// Api Core
const { ORM, ProductRepository, StoreRepository } = require('@mypharma/api-core')
// Check product pmc price
const getPmcProduct = require('./getPmcProduct')
// objectId type
const { ObjectId } = require('bson')

const parserCategory = (category) => {
  const result = {
    ...category,
    category_id: category._id,
    image: '',
    meta_title: category.metaTitle || '',
    meta_description: category.metaDescription || '',
    meta_keyword: category.metaKeyWord || '',
  }

  delete result.createdAt
  delete result.updatedAt
  delete result.deletedAt
  delete result._id
  delete result.metaTitle
  delete result.metaDescription
  delete result.metaKeyWord

  return result
}

const normalizeCategories = (categories) => {
  let normalized = []

  if (categories instanceof Array) {
    categories.forEach(v => {
      const result = parserCategory(v)

      if (result.subCategories) {
        normalized.push(...normalizeCategories(result.subCategories))
      }

      delete result.subCategories

      normalized.push(result)
    })
  } else {
    const result = parserCategory(categories)

    if (result.subCategories) {
      normalized.push(...normalizeCategories(result.subCategories))
    }

    delete result.subCategories

    normalized.push(result)
  }

  return normalized
}

const normalizeSpecials = (specials = [], storeId) => {
  if (specials.length === 0) return []
  let normalized = []

  specials.map(s => {
    normalized.push({
      ...s,
      store_id: storeId,
    })
  })

  return normalized
}

const normalizeProducts = (products, store) => {
  products = products.map(v => {
    if (v.classification === undefined) {
      v.classification = null
    } else {
      if (v.classification instanceof Array) {
        v.classification = v.classification[0]
      } else {
        v.classification = v.classification
      }
    }

    if (v.control === undefined) {
      v.control = null
    } else {
      if (v.control instanceof Array) {
        v.control = v.control[0]
      } else {
        v.control = v.control
      }
    }

    if (v.manufacturer === undefined) {
      v.manufacturer = null
    } else {
      if (!(v.manufacturer instanceof Array)) {
        v.manufacturer = [v.manufacturer]
      }
    }

    const result = {
      ...v,
      product_id: v._id,
      ean: v.EAN,
      ms: v.MS,
      active_principle: v.activePrinciple,
      meta_title: v.metaTitle || '',
      meta_description: v.metaDescription || '',
      image: v.image ? v.image.key : null,
      categories: normalizeCategories(v.category || []),
      slug: v.slug && v.slug.length > 0 ? v.slug.pop() : '',
      specials: normalizeSpecials(v.specials, store.storeId)
    }

    delete result._id
    delete result.EAN
    delete result.MS
    delete result.activePrinciple
    delete result.metaTitle
    delete result.metaDescription
    delete result.category
    delete result.createdAt
    delete result.updatedAt
    delete result.deletedAt

    return result
  })

  return products
}

const grabPatterns = async (sourceEan, activePrinciple, tenant) => {
  const products = await ProductRepository.repo(tenant).find({
    where: {
      EAN: {
        $ne: sourceEan
      },
      activePrinciple: activePrinciple,
      'classification.name': 'GENERICO',
      quantity: {
        $gt: 0
      },
      status: true
    }
  })

  return products
}

const retrieve = async (searchResponse, tenant) => {
  const { hits } = searchResponse
  const result = new Map([])

  // Setup ORM
  await ORM.setup(null, tenant)

  const productIds = hits.map(v => new ObjectId(v._source.product_id))
  const productEans = hits.map(v => v._source.ean)
  const store = await StoreRepository.repo().findOne({ tenant })

  const products = await ProductRepository.repo(tenant).find({
    where: {
      $or: [
        {
          _id: {
            $in: productIds
          }
        },
        {
          EAN: {
            $in: productEans
          }
        }
      ],
      quantity: {
        $gt: 0
      },
      status: true
    }
  })

  for await (let product of products) {
    if (!result.has(product._id)) {
      const searchResult = hits.find(v => v._source.product_id === product._id || v._source.ean === product.EAN)

      if (searchResult) {
        const { _score } = searchResult

        // Grab patterns
        if (product.classification && product.classification.name === 'ETICO') {
          let patterns = await grabPatterns(product.EAN, product.activePrinciple, tenant)
          patterns.forEach(v => {
            v.generic = true
            const { specials, price } = getPmcProduct(v, store)

            v.specials = specials
            v.price = price

            result.set(v._id, {
              ...v
            })
          })

          // Cleaning
          patterns = null
        }

        const { specials, price } = getPmcProduct(product, store)

        product.price = price
        product.specials = specials

        delete product.genericPattern
        product.generic = false

        result.set(product._id, {
          ...product,
          _score
        })
      }
    }
  }

  return result
}

module.exports = async (searchResponse, tenant, store) => {
  try {
    const retrieved = await retrieve(searchResponse, tenant)
    const products = []

    retrieved.forEach(v => products.push(v))

    return normalizeProducts(products, store).sort((a, b) => {
      if (a.quantity > 0 && b.quantity > 0) {
        if (a.generic === b.generic) {
          return b._score - a._score
        }

        if (a.generic) {
          return 1
        }

        if (b.generic) {
          return -1
        }
      }

      return b.quantity - a.quantity
    })
  } catch (err) {
    console.log(err)
    Sentry.captureException(err)

    return []
  }
}

