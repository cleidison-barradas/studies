const productSchema = {
  ms: 'MS',
  ean: 'EAN',
  name: 'name',
  slug: 'slug',
  price: 'price',
  erp_pmc: 'erp_pmc',
  image: 'image',
  status: 'status',
  product_id: '_id',
  control: 'control',
  quantity: 'quantity',
  pmcPrice: 'pmcPrice',
  specials: 'specials',
  manualPMC: 'manualPMC',
  categories: 'category',
  pmcValues: 'pmcValues',
  meta_title: 'metaTitle',
  manufacturer: 'manufacturer',
  description: 'description',
  presentation: 'presentation',
  classification: 'classification',
  active_principle: 'activePrinciple',
  meta_description: 'metaDescription',
}

const parserCategory = (category) => {
  const result = {
    ...category,
    category_id: category._id,
    image: '',
    meta_title: category.metaTitle || '',
    meta_description: category.metaDescription || '',
    meta_keyword: category.metaKeyWord || '',
  }

  delete result._id
  delete result.metaTitle
  delete result.metaKeyWord
  delete result.metaDescription
  delete result.originalCategoryId,
    delete result.originalId,
    delete result.createdAt
  delete result.deletedAt
  delete result.updatedAt

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

const normalizeSlugs = (slugs = []) => {
  if (slugs.length === 0) return ''

  return slugs.pop()
}

const normalizeManufacuters = (manufacturer = {}) => {
  if (Object.keys(manufacturer).length === 0) return null
  let normalize = []
  const result = {
    ...manufacturer,
    manufacturer_id: manufacturer._id,
    name: manufacturer.name
  }
  delete result._id

  normalize.push(result)

  return normalize
}

const normalizeClassification = (classification = {}) => {
  if (Object.keys(classification).length === 0) return null

  const result = {
    ...classification,
    classification_id: classification._id,
    name: classification.name
  }

  delete result._id

  return result
}

const normalizeImage = (image = {}) => {
  if (Object.keys(image).length === 0) return ''

  return image.key
}

const normalizeControl = (control = {}) => {
  if (Object.keys(control).length === 0) return null

  const result = {
    id: control._id,
    name: control.description,
    initials: control.initials
  }

  return result
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

const parserProducts = (products = [], storeId = '', pmc = null) => {
  let parsedProducts = []

  const fieldKeys = Object.keys(productSchema)
  const fieldValues = Object.values(productSchema)

  parsedProducts = products.map(item => {
    let obj = {}

    Object.keys(item).forEach(key => {
      const index = fieldValues.indexOf(key)

      if (index !== -1) {
        const field = fieldKeys[index]

        obj = {
          ...obj,
          [field]: item[key]
        }
      }
    })

    return obj
  })

  parsedProducts = parsedProducts.map(p => {
    return {
      ...p,
      slug: normalizeSlugs(p.slug),
      image: normalizeImage(p.image),
      control: normalizeControl(p.control),
      categories: normalizeCategories(p.categories),
      specials: normalizeSpecials(p.specials, storeId),
      manufacturer: normalizeManufacuters(p.manufacturer),
      classification: normalizeClassification(p.classification)
    }
  })

  const productsParsed = Object.assign([], parsedProducts)
  parsedProducts = []

  return productsParsed
}

module.exports = { parserProducts }