// Routing version
const name = 'v2'

const routes = {
  '/search': require('./search'),
  '/category': require('./category')
}

module.exports = {
  name,
  routes
}
