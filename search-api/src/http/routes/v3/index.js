const name = 'v3'

const routes = {
  '/search': require('./search'),
  '/category': require('./category'),
  '/address': require('./address'),
  '/product': require('./product')
}

module.exports = {
  name,
  routes
}
