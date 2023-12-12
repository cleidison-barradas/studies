/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Get,
  Req,
  Post,
  Body,
  Param,
  Response,
  ApiRequest,
  UseBefore,
  NotFoundError,
  JsonController,
  DeliverySchedule,
  InternalServerError,
  CustomerTenancyMiddleware,
  Params,
} from '@mypharma/api-core'
import { ApiShippingService } from '../../../adapters/ApiShippingService'
import { ViaCepService } from '../../../adapters/ViaCepService'
import { normalizeStr } from '../../../helpers/normalizeString'
import { PostcodeService } from '../../../ports/PostcodeService'
import { ShippingProduct, ShippingService } from '../../../ports/ShippingService'
import { LoadStoreByID } from '../cart/cart.service'
import { getProducts } from '../product/product.service'
import { GetShippingProductRequestData } from './delivery.interface'

import { getCities, getDeliveryFee, getDeliveryFeeByNeighborhoodName, getDistanceDeliveryFee, getRegions, getSchedule } from './delivery.service'

@JsonController('/v2/delivery')
@UseBefore(CustomerTenancyMiddleware)
export class DeliveryController {
  postcodeService: PostcodeService = new ViaCepService()
  shippingService: ShippingService = new ApiShippingService()

  @Get('/cities')
  public async cities(@Req() request: ApiRequest) {
    try {
      const cities = await getCities(request.tenant)

      return { cities }
    } catch (error) {
      return Response.error(error.name, error.message)
    }
  }

  @Get('/regions/:neighborhood?')
  public async regions(@Req() request: ApiRequest, @Params() { neighborhood = null }: { neighborhood: string }) {
    try {
      const regions = await getRegions(request.tenant, neighborhood)

      return { regions }
    } catch (error) {
      return Response.error(error.name, error.message)
    }
  }

  @Get('/deliveryFees')
  public async deliveryFees(@Req() request: ApiRequest) {
    try {
      const regions = await getDeliveryFee(request.tenant)
      return { regions }
    } catch (error) {
      return Response.error(error.name, error.message)
    }
  }

  @Get('/distanceDeliveryFees')
  public async distanceDeliveryFees(@Req() request: ApiRequest) {
    try {
      const regions = await getDistanceDeliveryFee(request.tenant)
      return { regions }
    } catch (error) {
      return Response.error(error.name, error.message)
    }
  }

  @Get('/schedule')
  public async schedule(@Req() request: ApiRequest) {
    try {
      const result = await getSchedule(request.tenant)
      const schedule = []

      const weekDays = {
        MON: 1,
        TUE: 2,
        WED: 3,
        THU: 4,
        FRI: 5,
        SAT: 6,
        SUN: 7,
      }

      result.map((value: DeliverySchedule) => {
        if (value.weekDay === 'SATSUN') {
          for (let index = 6; index < 8; index++) {
            if (!schedule.find((old) => old.day === index)) {
              schedule.push({
                id: index,
                day: index,
                start: value.start,
                end: value.end,
                interval: value.interval,
              })
            }
          }
        }

        if (value.weekDay === 'MONTOFRI') {
          for (let index = 1; index < 6; index++) {
            if (!schedule.find((old) => old.day === index)) {
              schedule.push({
                id: index,
                day: index,
                start: value.start,
                end: value.end,
                interval: value.interval,
              })
            }
          }
        }

        if (value.weekDay === 'EVERYDAY') {
          for (let index = 1; index < 9; index++) {
            if (!schedule.find((old) => old.day === index)) {
              schedule.push({
                id: index,
                day: index,
                start: value.start,
                end: value.end,
                interval: value.interval,
              })
            }
          }
        }

        if (value.weekDay === 'HOLIDAY') {
          if (!schedule.find((old) => old.day === 8)) {
            schedule.push({
              id: 8,
              day: 8,
              start: value.start,
              end: value.end,
              interval: value.interval,
            })
          }
        }

        if (!schedule.find((old) => old.day === weekDays[value.weekDay]) && weekDays[value.weekDay]) {
          schedule.push({
            id: weekDays[value.weekDay],
            day: weekDays[value.weekDay],
            start: value.start,
            end: value.end,
            interval: value.interval,
          })
        }

        if (schedule.find((old) => old.day === weekDays[value.weekDay]) && weekDays[value.weekDay]) {
          const index = schedule.findIndex((old) => old.day === weekDays[value.weekDay])
          schedule.splice(index, 1, {
            id: weekDays[value.weekDay],
            day: weekDays[value.weekDay],
            start: value.start,
            end: value.end,
            interval: value.interval,
          })
        }
      })

      return { schedule }
    } catch (error) {
      return Response.error(error.name, error.message)
    }
  }

  @Post('/:postcode')
  public async getAddressInfo(@Req() request: ApiRequest, @Param('postcode') postcode: string, @Body() body: GetShippingProductRequestData) {
    const { session, tenant } = request
    const { store } = session

    const Store = await LoadStoreByID(store)

    const address = await this.postcodeService.getAddressByPostcode(postcode)

    const { neighborhood } = address

    if (!Store.settings?.config_best_shipping && !Store.settings.config_shipping_courier) {
      if (neighborhood) {
        const deliveryFees = await getDeliveryFeeByNeighborhoodName(tenant, new RegExp(normalizeStr(neighborhood), 'gi'))

        if (!deliveryFees) throw new NotFoundError('local delivery not found')

        return { local: deliveryFees }
      }
    } else {
      const deliveryFees = await getDeliveryFeeByNeighborhoodName(tenant, new RegExp(normalizeStr(neighborhood), 'gi'))

      const loadedProducts = await getProducts(
        tenant,
        body.products.map((value) => value._id)
      )

      const parsed = loadedProducts.map(
        (value): ShippingProduct => ({
          id: value._id.toString(),
          name: value.name,
          quantity: body.products.find((bodyProduct) => value._id.toString() === bodyProduct._id).quantity,
          maxQuantity: value.quantity,
          price: body.products.find((bodyProduct) => value._id.toString() === bodyProduct._id).price,
          slug: value.slug.pop(),
        })
      )

      const shipping = await this.shippingService
        .getShippingOptions(postcode, parsed, Store.settings?.config_best_shipping ? 'bestshipping' : 'courier', request.headers.authorization)
        .catch((err) => {
          console.log(err.response)
          throw new InternalServerError('error handling shipping service')
        })

      return { local: deliveryFees, shipping }
    }

    throw new NotFoundError('local delivery not found')
  }
}
