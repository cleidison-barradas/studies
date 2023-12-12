import { ApiRequest, AuthTenancyMiddleware, Body, Customer, Delete, DistanceDeliveryFeeRepository, Get, JsonController, Param, Put, Req, Res, UseBefore } from '@mypharma/api-core'
import { Response } from 'express'
import { ViaCepService } from '../../../adapters/ViaCepService'
import { PostcodeService } from '../../../ports/PostcodeService'

import {
  addCustomerAddress,
  deleteCustomerAddress,
  getCustomer,
  getStoreByTenant,
} from '../../../support/services/CustomerService'
import {
  deleteAddress,
  deletedAddress,
  getAddressGeocode,
  getNeighborhoodByName,
  putAddress,
  putAddressesGeocode,
} from './address.service'
import { getDistanceBetweenCoordinates } from '../../../helpers/get-distance-between-coordinates'
import { ObjectID } from 'bson'
import { settings } from 'cluster'

@JsonController('/v2/address')
@UseBefore(AuthTenancyMiddleware)
export class AddressController {
  postcodeService: PostcodeService = new ViaCepService()

  @Get('/')
  public async index(@Req() request: ApiRequest, @Res() response: Response) {
    try {
      const { tenant, session } = request
      const { _id } = session.user

      const store = await getStoreByTenant(tenant)
      const storeDeliveryRule = store.settings.config_local_delivery_rule ? store.settings.config_local_delivery_rule : 'neighborhood'

      const { addresses } = await getCustomer(tenant, _id)
      if (storeDeliveryRule === 'distance') {
        await putAddressesGeocode(tenant, _id, addresses)

        const updatedCustomer = await getCustomer(tenant, _id)
        const updatedAddresses = await updatedCustomer.addresses

        return response.json({
          addresses: updatedAddresses
        })
      } else {
        return response.json({
          addresses
        })
      }
    } catch (error) {
      response.status(500).json({
        error: error.message
      })
    }
  }

  @Put('/')
  public async put(@Req() request: ApiRequest<Customer>, @Body() body: any, @Res() response: Response) {
    try {
      const { session, tenant } = request
      const { user } = session
      const { street, complement, number, postcode, isMain, id: addressId, idCart } = body
      let { neighborhood } = body

      const store = await getStoreByTenant(tenant)
      const hasCourier = store.settings.config_shipping_courier || false
      const hasShipping = store.settings.config_best_shipping || false

      if (!store) {
        return response.status(404).json({
          error: 'store_not_found',
        })
      }

      const customer = await getCustomer(tenant, user._id)

      if (!customer) {
        return response.status(404).json({
          error: 'customer_not_found',
        })
      }

      if (isMain) {
        const { addresses } = customer
        const actualMain = addresses.find((address) => address.isMain)
        if (actualMain && actualMain._id.toString() !== addressId) {
          await deletedAddress(tenant, actualMain._id.toString())
          await deleteCustomerAddress(tenant, customer._id, actualMain._id.toString())
          const newAddress = await putAddress(tenant, { ...actualMain, isMain: false })
          await addCustomerAddress(tenant, customer._id, newAddress)
        }
      }

      const storeDeliveryRule = store.settings.config_local_delivery_rule ? store.settings.config_local_delivery_rule : 'neighborhood'

      if (storeDeliveryRule === 'neighborhood') {

        if (!neighborhood._id) {
          const hasAvailableNeighborhood = await getNeighborhoodByName(tenant, neighborhood)
          const availableNeigborhood = hasAvailableNeighborhood && hasAvailableNeighborhood.neighborhood ? hasAvailableNeighborhood.neighborhood : null

          if (!availableNeigborhood) {

            if (!hasShipping && !hasCourier) {
              throw new Error('address_invalid')
            }

          } else {
            neighborhood = {
              _id: new ObjectID(availableNeigborhood._id.toString()),
              ...availableNeigborhood
            }
          }
        }
      }

      const addressInfo = { street, complement, number, postcode, neighborhood, isMain }

      if (storeDeliveryRule === 'distance') {
        const addressGeoInfo = await getAddressGeocode(postcode, street, number, neighborhood)
        if (addressGeoInfo?.results && addressGeoInfo.results.length > 0) {
          if (addressGeoInfo.results[0].lat && addressGeoInfo.results[0].lon) {
            let distanceFee = 0

            const distancesDeliveryFee = await DistanceDeliveryFeeRepository.repo(tenant).find()
            if (distancesDeliveryFee.length > 0) {
              const deliveryWithMaxDistance = distancesDeliveryFee.reduce((maxDistanceDelivery, currentDelivery) => {
                const maxDistance = maxDistanceDelivery ? maxDistanceDelivery.distance || 0 : 0
                const currentDistance = currentDelivery.distance || 0

                return maxDistance > currentDistance ? maxDistanceDelivery : currentDelivery
              })

              distanceFee = deliveryWithMaxDistance.distance
            }
            addressInfo['latitude'] = addressGeoInfo.results[0].lat
            addressInfo['longitude'] = addressGeoInfo.results[0].lon
            const distanceAddress = getDistanceBetweenCoordinates(
              {
                latitude: addressInfo['latitude'],
                longitude: addressInfo['longitude'],
              },
              {
                latitude: store.settings.config_address_latitude,
                longitude: store.settings.config_address_longitude,
              },
            )
            const distanceFeeInKilometers = distanceFee / 1000

            if (distanceAddress > distanceFeeInKilometers) {

              if (!hasShipping && !hasCourier) {
                throw new Error('address_invalid')
              }

            }
          }
        }
      }

      if (addressId) {
        await deleteAddress(tenant, addressId)
        await deleteCustomerAddress(tenant, customer._id, addressId)
      }

      const address = await putAddress(tenant, addressInfo)
      await addCustomerAddress(tenant, customer._id, address)

      const { addresses } = await getCustomer(tenant, user._id)

      return response.json({
        addresses
      })

    } catch (error) {
      console.log(error)
      return response.status(500).json({
        error: error.message
      })
    }
  }

  @Delete('/:id')
  public async delete(@Req() request: ApiRequest<Customer>, @Param('id') id: string, @Res() response: Response) {
    try {
      const { tenant, session } = request
      const { user } = session

      await deleteCustomerAddress(tenant, user._id, id)
      await deleteAddress(tenant, id)

      return response.status(200).json({
        message: 'Endereço deletado com sucesso'
      })

    } catch (error) {
      return response.status(500).json({
        error: error.message
      })
    }
  }

  @Get('/cep/:postcode')
  public async getByPostcode(@Param('postcode') postcode: string, @Res() response: Response) {
    try {
      const address = await this.postcodeService.getAddressByPostcode(postcode)

      return response.json({
        address
      })

    } catch (error) {
      console.log(error)
      return response.status(500).json({
        error: error.message
      })

    }
  }
}
