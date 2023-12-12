import { Get, Req, Res, Param, UseBefore, ApiRequest, JsonController, CustomerTenancyMiddleware } from '@mypharma/api-core'
import { GetAddressByCEP } from '../../../../services/search-cep'
import { Response } from 'express'
import { GetStoreGroup, FindDeliveryStoreByNeighborhood } from '../services/StoreGroupService'
import { getStore } from '../../../../support/services/StoreService'

@UseBefore(CustomerTenancyMiddleware)
@JsonController('/v1/location')
export class LocationController {
  @Get('/:postcode')
  public async index(@Req() request: ApiRequest, @Param('postcode') postcode: number, @Res() response: Response) {
    try {
      const {
        tenant,
        session: { store },
      } = request
      const mainStore = await getStore(store)
      const { data, ok } = await GetAddressByCEP(postcode)

      if (ok) {
        const storeGroups = await GetStoreGroup(tenant)

        if (storeGroups.length > 0) {
          const { stores } = storeGroups.pop()

          const storeThatDelivery = await FindDeliveryStoreByNeighborhood(stores, data.neighborhood)

          if (storeThatDelivery.length > 0) {
            storeThatDelivery.push({
              name: mainStore.name,
              url: mainStore.url,
              address: {
                street: mainStore.settings['config_address'],
                city: mainStore.settings['config_store_city'],
                number: mainStore.settings['config_store_number'],
              },
            })

            return response.json({
              groups: storeThatDelivery,
              match: true,
            })
          }

          const groups = stores.map((store) => {
            return {
              name: store.name,
              url: store.url,
              address: {
                street: store.settings['config_address'],
                city: store.settings['config_store_city'],
                number: store.settings['config_store_number'],
              },
            }
          })

          groups.push({
            name: mainStore.name,
            url: mainStore.url,
            address: {
              street: mainStore.settings['config_address'],
              city: mainStore.settings['config_store_city'],
              number: mainStore.settings['config_store_number'],
            },
          })

          return response.json({
            groups,
            match: false,
          })
        }
      } else {
        return response.status(400).json({
          error: data.errors.find((e) => e.service === 'correios').message,
        })
      }
    } catch (error) {
      console.log(error)
      return response.status(500).json({
        error: 'cep_error',
      })
    }
  }
}
