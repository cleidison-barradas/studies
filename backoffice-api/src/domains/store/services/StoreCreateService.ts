/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { GenericObject, Pmc, Store, StorePlan, StoreRepository } from '@mypharma/api-core'

interface StoreCreateServiceDTO {
  pmc?: Pmc
  url: string
  name: string
  tenant: string
  plan: StorePlan
  originalId: number
  mainStore: boolean
  settings: GenericObject
}

class StoreCreateService {
  constructor(private repository?: any) { }

  public async createStore({ url, name, tenant, settings, plan, originalId, pmc = null, mainStore = false }: StoreCreateServiceDTO) {
    let store = new Store()

    store._id = undefined
    settings['config_url'] = url
    settings['config_ssl'] = url

    if (pmc) {
      store.pmc = pmc
    }

    store.url = url
    store.name = name
    store.plan = plan
    store.tenant = tenant
    store.settings = settings
    store.affiliateStores = []
    store.mainStore = mainStore
    store.originalId = originalId
    store.createdAt = new Date()

    store = await StoreRepository.repo().createDoc(store)

    return store
  }
}

export default StoreCreateService
