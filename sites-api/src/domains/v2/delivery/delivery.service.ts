import { DeliveryFeeRepository, DeliveryScheduleRepository, DistanceDeliveryFeeRepository } from '@mypharma/api-core'
import { Types } from 'mongoose'
import { ObjectId } from 'bson'

export async function getCities(tenant: string) {
  const deliveryFees = await DeliveryFeeRepository.repo<DeliveryFeeRepository>(tenant).find({})
  const neighborhoods = deliveryFees.map((v) => v.neighborhood)
  const cities = []

  neighborhoods.forEach((v) => {
    if (!cities.find((c) => c._id === v.city._id) && typeof v.city === 'object') {
      cities.push(v.city)
    }
  })

  return cities.map((v) => {
    return {
      ...v,
      neighborhoods: neighborhoods.filter((n) => n.city._id === v._id),
    }
  })
}

export function getSchedule(tenant: string) {
  return DeliveryScheduleRepository.repo<DeliveryScheduleRepository>(tenant).find({})
}

export function getDeliveryFee(tenant: string) {
  return DeliveryFeeRepository.repo<DeliveryFeeRepository>(tenant)
    .aggregate([
      {
        $group: { _id: '$neighborhood.city.name', averageTime: { $avg: '$deliveryTime' }, deliveryFees: { $push: '$$ROOT' } },
      },
      {
        $sort: { averageTime: 1 },
      },
    ])
    .toArray()
}

export function getRegions(tenant: string, neighborhood?: string) {

  if (Types.ObjectId.isValid(neighborhood)) {
    const _id = new ObjectId(neighborhood)

    return DeliveryFeeRepository.repo(tenant).find({
      where: {
        'neighborhood._id': _id
      },
      order: { feePrice: 1 },
    })
  }
  return DeliveryFeeRepository.repo(tenant).find({
    order: { feePrice: 1 }
  })
}

export function getDeliveryFeeByCityName(tenant: string, cityName: string | RegExp) {
  return DeliveryFeeRepository.repo(tenant).find({
    where: {
      'neighborhood.city.name': cityName,
    },
  })
}

export async function getDeliveryFeeByNeighborhoodName(tenant: string, neighborhoodName: string | RegExp) {
  return DeliveryFeeRepository.repo(tenant).find({
    where: {
      'neighborhood.name': neighborhoodName,
    },
  })
}

export async function getDistanceDeliveryFee(tenant: string) {
  return await DistanceDeliveryFeeRepository.repo(tenant).find(
    {order: { distance: 1 }}
  )
}