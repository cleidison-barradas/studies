import { Response, ApiRequest, Get, Req, UseBefore, AuthTenancyMiddleware, Put, Body, JsonController, Customer, Delete, Param, Res } from '@mypharma/api-core'
import { Response as IResponse } from 'express'
import databaseConfig from '../../../../config/database'

import { addCustomerAddress, deleteCustomerAddress, getCustomer, UpdateCustomerAddress } from '../../../../support/services/CustomerService'
import IPutAddressRequest from '../interfaces/IPutAddressRequest'

import { getAddress, getNeighborhood, putAddress, UpdateAddress } from '../services/AddressService'

@JsonController('/v1/address')
@UseBefore(AuthTenancyMiddleware)
export class AddressController {
  @Get('/')
  public async index(@Req() request: ApiRequest) {
    try {
      const { user } = request.session

      const { addresses } = await getCustomer(request.tenant, user._id)

      const result = []

      addresses.map(address => {
        result.push({
          address_id: address._id.toString(),
          firstname: user.firstname,
          lastname: user.lastname,
          complement: address.complement,
          country: 'brasil',
          city: address.neighborhood.city.name,
          street: address.street,
          not_deliverable: address.notDeliverable,
          neighborhood: {
            neighborhood_id: address.neighborhood._id,
            city_id: address.neighborhood.city,
            name: address.neighborhood.name,
            city: {
              name: address.neighborhood.city.name,
              zone: {
                code: address.neighborhood.city.state.name,
              },
            },
          },
          postcode: address.postcode,
          addressType: address.addressType,
          number: address.number
        })
      })

      return { addresses: result }
    } catch (error) {
      return Response.error(error.name, error.message)
    }
  }

  @Put('/')
  public async put(@Req() request: ApiRequest<Customer>, @Body() body: IPutAddressRequest, @Res() response: IResponse) {
    try {
      const { user } = request.session
      const { address_id, street, complement, number, neighborhood_id, postcode, not_deliverable = false, addressType = 'own_delivery' } = body
      let address = null
      let neighborhood = null

      const customer = await getCustomer(request.tenant, request.session.user._id)

      if (!customer) {
        return response.status(404).json({
          error: 'customer_not_found',
        })
      }

      if (addressType === 'own_delivery') {
        neighborhood = await getNeighborhood(databaseConfig.name, neighborhood_id)

        if (!neighborhood) {
          return response.status(404).json({
            error: 'neighborhood_not_found',
          })
        }
      }

      if (addressType === 'delivery_company') {
        neighborhood = {
          name: body.neighborhood,
          city: {
            name: body.city,
            state: {
              name: body.state_address,
              country: {
                name: 'BRASIL',
                code: 'BR'
              }
            }
          }
        }
      }

      if (address_id) {
        await UpdateAddress(request.tenant, address_id, {
          street,
          number,
          postcode: postcode.length > 0 && postcode.replace(/[^0-9]/g, ''),
          complement,
          neighborhood,
        })

        address = await getAddress(request.tenant, address_id)

        await UpdateCustomerAddress(request.tenant, user._id.toString(), address_id, address)
      } else {

        address = await putAddress(request.tenant, {
          street,
          complement,
          number,
          neighborhood,
          postcode: postcode.length > 0 && postcode.replace(/[^0-9]/g, ''),
          notDeliverable: not_deliverable,
          addressType
        })

        await addCustomerAddress(request.tenant, customer._id, address)
      }


      return {
        address: {
          address_id: address._id.toString(),
          firstname: user.firstname,
          lastname: user.lastname,
          complement: address.complement,
          not_deliverable: address.notDeliverable,
          country: address.neighborhood.city.state.country.name,
          city: {
            name: address.neighborhood.city.name,
            zone: {
              code: address.neighborhood.city.state.name,
            },
          },
          street: address.street,
          neighborhood: {
            neighborhood_id: address.neighborhood._id || '',
            name: address.neighborhood.name,
          },
          postcode: address.postcode,
        },
      }
    } catch (error) {
      console.log(error)
      return response.status(500).json({
        error: 'internal_server_error',
      })
    }
  }

  @Delete('/:id')
  public async delete(@Req() request: ApiRequest<Customer>, @Param('id') id: string) {
    try {
      const { tenant, session } = request
      const { user } = session

      // await deleteAddress(tenant, id)

      const a = await deleteCustomerAddress(tenant, user._id, id)

      return { deletedId: id, a }
    } catch (error) {
      return Response.error(error.name, error.message)
    }
  }
}
