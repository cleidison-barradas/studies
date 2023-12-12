require('dotenv').config()
const { ORM, ProductRepository, StoreRepository } = require('@mypharma/api-core')
const Config = require('../config')

exports.default = (async () => {
  ORM.config = Config.databases.mongoConfig
  await ORM.setup()

  const stores = await StoreRepository.repo().find({
    select: ['tenant']
  })

  const tenants = stores.map(store => store.tenant)

  for await (const tenant of tenants) {
    await ORM.setup(null, tenant)

    try {
      await ProductRepository.repo(tenant).createCollectionIndex('EAN', { unique: true })
    } catch (error) {
      console.log(error)
    }
  }
  console.log('finished process')
})()