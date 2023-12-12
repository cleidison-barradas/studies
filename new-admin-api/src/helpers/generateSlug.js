const formatString = (string = '') =>
  allTrim(
    string.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9 ]/g, '')
  )
    .replace(/\s/g, '-')

const allTrim = (string = '') => string.replace(/\s+/g, ' ').replace(/^\s+|\s+$/, '')

module.exports = {
  async generateSlug(product, model) {
    let slug = ''
    if (product.name && product.name.length > 0) {
      slug += `${formatString(product.name)}`
    }

    if (product.manufacturer && product.manufacturer.name.length > 0) {
      slug += `-${formatString(product.manufacturer.name)}`
    }

    // Check if already exists
    const count = await model.countDocuments({ slug })

    if (count > 0) {
      slug += `-${count + 1}`
    }

    return slug
  }
}
