require('dotenv').config()
const Config = require('../config')
const { ORM, StoreRepository, PaymentMethodRepository } = require('@mypharma/api-core');

let pixStores = new Map([])

exports.default = (async () => {
    ORM.config = Config.databases.mongoConfig
    await ORM.setup()

    const stores = await StoreRepository.repo().find()
    const tenants = stores.map(store => store.tenant)

      if (tenants.length > 0) {
        for await (const tenant of tenants) {
            await ORM.setup(null, tenant)

            const store = await PaymentMethodRepository.repo(tenant).find({})
            const storeConfig = await StoreRepository.repo(tenant).find({})
            store.forEach(method => {
                storeConfig.forEach(config => {
                    if (method.paymentOption.name === 'Pix' && method.paymentOption.type === 'gateway') {
                        pixStores.set(tenant, {
                            storeName: tenant,
                            cnpj: config.settings.config_cnpj
                        })
                    }
                })
            })
        }
      }
      console.table(pixStores)
      console.log("End!")
      process.exit(0)
})()
