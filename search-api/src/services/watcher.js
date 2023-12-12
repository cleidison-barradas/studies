// UUID
const { v4: uuid, validate: isUuid } = require('uuid')

// AMQP
const amqp = require('./amqp')

const sendData = async ({ fingerprint, store = null, user = null, products = [], query, request }) => {
  if (query.length === 0 || products.length === 0) return false

  // Create fingerprint
  if (!fingerprint || !isUuid(fingerprint)) {
    fingerprint = uuid()
  }

  // Map products
  products = products.map(v => {
    return {
      id: Number(v.product_id),
      ean: Number(v.ean),
      name: `${v.model} ${v.name}`,
      price: Number(v.price),
      quantity: Number(v.quantity)
    }
  })

  const data = {
    fingerprint,
    store,
    user,
    products,
    term: query,
    origin: request.headers['origin'] || '',
    userAgent: request.headers['user-agent'] || ''
  }

  await amqp.publish('search-capture', data)
  return fingerprint
}

module.exports = {
  sendData
}
