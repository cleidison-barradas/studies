import { StoreRepository } from '@mypharma/api-core'

export function getRegistredStore() {
  return StoreRepository.repo().find({
    where: {
      tenant: { $in: ['bigdrogariamenorprecosp', 'drogariaorfarma'] },
      'settings.config_ifood_client_secret': { $exists: true, $ne: '' },
      'settings.config_ifood_client_id': { $exists: true, $ne: '' },
      'settings.config_ifood_store_id': { $exists: true, $ne: '' },
    },
    select: ['name', 'tenant', 'settings']
  })
}
