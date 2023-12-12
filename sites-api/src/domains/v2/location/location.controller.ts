import { ApiRequest, CustomerTenancyMiddleware, Get, JsonController, Param, Req, Res, UseBefore } from '@mypharma/api-core'
import { Response } from 'express'
import { getDistanceBetweenCoordinates } from '../../../helpers/get-distance-between-coordinates'
import { validateCEP } from '../../../services/search-cep'
import { getStore } from '../../../support/services/StoreService'
import { CITY_WITH_LATITUDE_OF_LONGITUDE } from './mock/cityWithLatitudeOfLongitude'
import { GetStoreGroup } from './storeGroup.service'

interface Item {
  distance: number
  name: string
  url: string
  storeName: string
  storeUrl: string
  label?: string
  storeAddress: {
    street: string
    city: string
    number: number
  },
  address: {
    street: string
    city: string
    number: number
  },
}

interface Address {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
  ibge: string
  gia: string
  ddd: string
  siafi: string
  erro?: string
}

interface CityWithLatitudeOfLongitude {
  uf: string
  state: string
  municipio: string
  latitude: number,
  longitude: number,
  county: string
}

const MAXIMUM_KILOMETER = 100

@UseBefore(CustomerTenancyMiddleware)
@JsonController('/v2/location')
export class LocationController {
  @Get('/:zipcode')
  public async index(@Req() request: ApiRequest, @Param('zipcode') zipcode: string, @Res() response: Response) {
    try {
      const {
        tenant,
        session: { store },
      } = request
      const items: Item[] = []

      const mainStore = await getStore(store)

      const addressUser: Address = await validateCEP(zipcode)

      if (addressUser.erro) {
        return response.status(500).json({
          error: 'User zip code not found.',
        })
      }

      const userCity = CITY_WITH_LATITUDE_OF_LONGITUDE.find((item) => item.municipio === addressUser.localidade && item.uf === addressUser.uf) as CityWithLatitudeOfLongitude

      if (userCity) {
        const storeGroups = await GetStoreGroup(tenant)

        if (storeGroups.length > 0) {
          const stores = [].concat(...storeGroups.map((item) => item.stores))

          for (const store of stores) {
            const addressStore: Address = await validateCEP(String(store.settings.config_cep).trim().replace('-', ''))

            if (addressStore.erro === 'true') {
              continue
            }

            const storeCity = CITY_WITH_LATITUDE_OF_LONGITUDE.find((item) => item.municipio === addressStore.localidade && item.uf === addressStore.uf) as CityWithLatitudeOfLongitude

            if(storeCity) {
              const distance = getDistanceBetweenCoordinates(
                {
                  latitude: userCity.latitude,
                  longitude: userCity.longitude,
                },
                {
                  latitude: storeCity.latitude,
                  longitude: storeCity.longitude,
                },
              )

              const item: Item = {
                distance,
                name: mainStore.name,
                url: mainStore.url,
                storeName: store.name,
                storeUrl: store.url,
                storeAddress: {
                  street: store.settings['config_address'],
                  city: store.settings['config_store_city'],
                  number: store.settings['config_store_number'],
                },
                address: {
                  street: mainStore.settings['config_address'],
                  city: mainStore.settings['config_store_city'],
                  number: mainStore.settings['config_store_number'],
                },
              }

              if (distance <= MAXIMUM_KILOMETER) {
                items.push(item)
              }

              if (distance > MAXIMUM_KILOMETER && store.settings['config_shipping_courier'] || store.settings['config_best_shipping']) {
                item.label = 'Entrega para todo o Brasil'
                items.push(item)
              }

              continue
            }

          }

          const storesOrdernation = items.sort((a, b) => a.distance - b.distance)

          return response.json({
            groups: storesOrdernation,
            match: true,
          })
        }

        return response.json({
          groups: [],
          match: false,
        })
      }
    } catch (error) {
      console.error(error)
      return response.status(500).json({
        error: 'cep_error',
      })
    }
  }
}

