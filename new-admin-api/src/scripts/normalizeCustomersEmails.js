require('dotenv').config()
const Config = require('../config')
const { ORM, CustomerRepository, StoreRepository } = require('@mypharma/api-core');

/**
 * Run through all customers of all stores setting their emails to lowercase
 */
 exports.default = (async () => {
  ORM.config = Config.databases.mongoConfig
  await ORM.setup()
  console.log("Inicio Normalização de emails")
  const stores = await StoreRepository.repo().find()

  const tenants = stores.map(store => store.tenant)
  console.log(tenants.length)
  if (tenants.length > 0) {
    for await (const tenant of tenants) {
      try {
        await ORM.setup(null, tenant)
        const customers = await CustomerRepository.repo(tenant)
        const emails = await customers.distinct("email", { email: { $exists: true } });
        for (const email of emails) {
          try {
            await customers.updateOne(
              { email: email },
              { $set: { email: email.toLowerCase() } }
            )
          } catch (err) {
            console.log(`Erro ao rodar na loja ${tenant}, email ${email}: ${err.message}`)
            continue // continue to next email
          }
        }
      } catch (err) {
        console.log(`Erro ao rodar na loja ${tenant}: ${err.message}`)
        continue // continue to next tenant
      }
    }
  }
  console.log("Normalizacao de emails Concluida")
})()