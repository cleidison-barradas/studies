/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Response,
  ApiRequest,
  Get,
  Req,
  UseBefore,
  DeliverySchedule,
  CustomerTenancyMiddleware,
  JsonController,
  Params,
} from '@mypharma/api-core'

import {
  getCities,
  getDeliveryFee,
  getSchedule,
} from '../services/DeliveryService'

@JsonController('/v1/delivery')
@UseBefore(CustomerTenancyMiddleware)
export class DeliveryController {
  @Get('/cities')
  public async cities(@Req() request: ApiRequest) {
    try {
      const cities = await getCities(request.tenant)

      return { cities }
    } catch (error) {
      return Response.error(error.name, error.message)
    }
  }

  /**
   * DEPRECATED
   */
  @Get('/neighborhoods')
  public async neighborhoods() {
    return { neighborhoods: [] }
  }

  @Get('/area/:neighborhood?')
  public async deliveryArea(
    @Req() request: ApiRequest,
    @Params() { neighborhood = '' }: { neighborhood: string }
  ) {
    try {
      let deliveries = []
      const result = await getDeliveryFee(request.tenant, neighborhood)

      deliveries = result.map((d) => {
        const {
          _id,
          feePrice,
          freeFrom,
          deliveryTime,
          minimumPurchase,
          neighborhood,
        } = d
        const { city } = neighborhood
        const { state } = city

        return {
          delivery_id: _id,
          delivery_fee: feePrice,
          delivery_time: deliveryTime,
          free_from: freeFrom,
          minimum_value: minimumPurchase,
          neighborhood: {
            neighborhood_id: neighborhood._id,
            name: neighborhood.name,
            city: {
              city_id: city._id,
              name: city.name,
              zone: {
                name: state.name,
                code: state.code,
              },
              zone_id: state._id,
            },
            city_id: city._id,
          },
          neighborhood_id: neighborhood._id,
        }
      })

      return { deliveries }
    } catch (error) {
      return Response.error(error.name, error.message)
    }
  }

  @Get('/regions/:_id?')
  public async regions(@Req() request: ApiRequest) {
    try {
      const regions = await getDeliveryFee(request.tenant)
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
            })
          }
        }

        if (
          !schedule.find((old) => old.day === weekDays[value.weekDay]) &&
          weekDays[value.weekDay]
        ) {
          console.log(value.weekDay)
          schedule.push({
            id: weekDays[value.weekDay],
            day: weekDays[value.weekDay],
            start: value.start,
            end: value.end,
          })
        }

        if (
          schedule.find((old) => old.day === weekDays[value.weekDay]) &&
          weekDays[value.weekDay]
        ) {
          const index = schedule.findIndex(
            (old) => old.day === weekDays[value.weekDay]
          )
          schedule.splice(index, 1, {
            id: weekDays[value.weekDay],
            day: weekDays[value.weekDay],
            start: value.start,
            end: value.end,
          })
        }
      })

      return { schedule }
    } catch (error) {
      return Response.error(error.name, error.message)
    }
  }
}
