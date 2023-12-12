// Routing version
const name = 'v1'

const routes = {
  '/search': require('./search'),
  '/category': require('./category'),
}

module.exports = {
  name,
  routes
}
