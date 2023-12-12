import { CustomerRepository, ORM, StoreRepository } from '@mypharma/api-core'
import { databaseConfig } from '../../config/database'

export default class CustomerService {
  async getCustomers(tenant?: string) {
    ORM.config = databaseConfig
    await ORM.setup()

    const stores = await StoreRepository.repo().find()
    const tenants = stores.map(store => store.tenant)
    if (tenants.length > 0) {
      for await (const tenant of tenants) {
        try {
          await ORM.setup(null, tenant)
          const customers = await CustomerRepository.repo(tenant)

          await customers.dropCollectionIndex('cpf_1')

        } catch (err) {
          console.log(`Erro ao rodar na loja ${tenant}: ${err.message}`)
          continue
        }
      }
    }
    console.log('Remocao de Indexes de CPFs concluida')
    return 'indexes de cpf removidos'
  }
}
