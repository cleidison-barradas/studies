const { StoreRepository } = require('@mypharma/api-core')

function getStore(tenant = '') {
  if (tenant.length > 0) {
    return StoreRepository.repo().findOne({
      where: { tenant }
    })
  }
  return StoreRepository.repo().find({})
}

module.exports = { getStore }
