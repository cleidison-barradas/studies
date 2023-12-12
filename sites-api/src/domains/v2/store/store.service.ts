import { StoreRepository, ObjectID, GenericObject, StoreGroupRepository, InstallationRepository, ORM } from '@mypharma/api-core'
import { IstoreGroup } from './interfaces/storeGroup'

export class StoreService {
  private VALID_SETTINGS = ['config_name', 'config_store_city', 'config_logo', 'config_navbar_color']

  public async getStore(storeId: string | number) {
    const store = await StoreRepository.repo<StoreRepository>().findOne({
      select: ['name', 'url', 'settings'],
      where: {
        ...(ObjectID.isValid(storeId) ? { _id: new ObjectID(storeId) } : { originalId: Number(storeId) }),
      },
    })

    // Parse store
    if (store) {
      Object.keys(store.settings).forEach((key) => {
        if (!this.VALID_SETTINGS.includes(key)) {
          delete store.settings[key]
        }
      })
    }

    return store
  }

  public async getStoreByURL(url: string) {
    const store = await StoreRepository.repo<StoreRepository>().findOne({
      select: ['name', 'url', 'settings'],
      where: {
        url: new RegExp(url, 'gi'),
      },
    })

    // Parse store
    if (store) {
      Object.keys(store.settings).forEach((key) => {
        if (!this.VALID_SETTINGS.includes(key)) {
          delete store.settings[key]
        }
      })
    }

    return store
  }

  //Get main store from filial url
  public async getMainStore(url: string) {
    const store = await StoreRepository.repo<StoreRepository>().findOne({
      select: ['name', 'url', 'settings', 'storeUrls' ],
      where: {
        storeUrls:  {$elemMatch: {url_address: url}}
      },
    })
    return store
  }

  //get informantions from stores in storeUrls
  public async getFilialsInformation(storeGroup: Array<GenericObject>) {
    const parsedStoreGroup : IstoreGroup[] = []

    for (let i = 0; i < storeGroup.length; i++) {

      const filialStoreSettings = await StoreRepository.repo<StoreRepository>().findOne({
        select: ['name', 'url', 'settings' ],
        where: {
          url: storeGroup[i].url_address
        },
      })

      if(filialStoreSettings){
        parsedStoreGroup.push({
          'name': storeGroup[i].url_name,
          'url' : storeGroup[i].url_address,
          'address' : `${filialStoreSettings.settings.config_address}, ${filialStoreSettings.settings.config_store_number} - ${filialStoreSettings.settings.config_store_city}`
        })
      }
    }

    return parsedStoreGroup
  }

  //get store group that contains store, works to find group from cep popup stores
  public async getStoreGroup(url: string) {
    const stores = await StoreRepository.repo().find( {select: ['tenant', 'name', 'url', 'settings']}) //all stores from storeAdmin collection
    const tenants = stores.map(store => store.tenant)

    const StoreGroup = undefined

    if (tenants.length>0) {
      const mainStore = stores.find(s => s.url === url)

      //searchs for a storegroup that contains filial with url equal to parametrer url
      for await (const tenant of tenants){
        await ORM.setup(null, tenant)
        const findStoreGroup = await StoreGroupRepository.repo(tenant).findOne({
          where: {
            stores:  {$elemMatch: {url: url}}
          },
        }) || //if store isnt filial check if its mainstore
                                  await StoreGroupRepository.repo(mainStore.tenant).findOne({
                                    where:{
                                      stores: {$exists: true}
                                    },
                                  })

        //if found store group that contains one store with url equal to parametrer url
        if (findStoreGroup!== undefined){

          const parsedStoreGroup = []

          //add main store information to parsedStoreGroup
          parsedStoreGroup.push({
            'name': mainStore.name,
            'url' : mainStore.url,
            'address' : `${mainStore.settings.config_address}, ${mainStore.settings.config_store_number} - ${mainStore.settings.config_store_city}`
          })

          //add filials information to parsedStoreGroup
          for (let i = 0; i < findStoreGroup.stores.length; i++) {
            parsedStoreGroup.push({
              'name': findStoreGroup.stores[i].name,
              'url' : findStoreGroup.stores[i].url,
              'address' : `${findStoreGroup.stores[i].settings.config_address}, ${findStoreGroup.stores[i].settings.config_store_number} - ${findStoreGroup.stores[i].settings.config_store_city}`
            })
          }

          return parsedStoreGroup
        }
      }

      return StoreGroup
    }
  }

  //Store data from PWA installations
  public async storeInstallationData(installationData: {clientIP: string, userAgent: string}, tenant: string) {
    const {clientIP = ''} = installationData
    await ORM.setup(null, tenant)

    if(clientIP.length>0){

      const installations = await InstallationRepository.repo<InstallationRepository>(tenant).findOne({
        where: {clientIP : clientIP}
      })
      if(installations){
        return 'this user has already installed'
      }
      else{
        const createdAt = new Date()
        const installationDataWithTimestamp = {...installationData, createdAt}
        const Newinstallation = await InstallationRepository.repo<InstallationRepository>(tenant).insertOne(installationDataWithTimestamp)
        return 'installation data stored suceffuly'
      }
    }
  }
}
