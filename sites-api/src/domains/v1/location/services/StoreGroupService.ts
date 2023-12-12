import {
  StoreGroupRepository,
  DeliveryFeeRepository,
  ORM,
  Store,
} from '@mypharma/api-core'
import { IReturnStoreThatDelivery } from '../interfaces/IResponseFindDeliveryStore'

export function GetStoreGroup(tenant: string) {
  return StoreGroupRepository.repo<StoreGroupRepository>(tenant).find({})
}

export async function FindDeliveryStoreByNeighborhood(
  stores: Store[],
  neighborhood: string
): Promise<IReturnStoreThatDelivery[]> {
  const storeThatDelivery: IReturnStoreThatDelivery[] = []

  for await (const store of stores) {
    await ORM.setup(null, store.tenant)

    const delivery = await DeliveryFeeRepository.repo<DeliveryFeeRepository>(
      store.tenant
    ).findOne({
      where: {
        'neighborhood.name': { $regex: neighborhood.toUpperCase(), $options: 'i' },
      },
    })

    if (delivery) {
      storeThatDelivery.push({
        name: store.name,
        url: store.url,
        address: {
          street: store.settings['config_address'],
          city: store.settings['config_store_city'],
          number: store.settings['config_store_number'],
        },
      })
    }
  }

  return storeThatDelivery
}
