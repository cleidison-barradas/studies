
export const parserCategory = (category: any) => {
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

export const normalizeCategories = (categories: any[] | any | null | undefined) => {
  if (!categories) return []

  const normalized: any[] = []

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