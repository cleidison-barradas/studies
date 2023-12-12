import {
  DeliveryFeeRepository,
  DeliveryScheduleRepository,
} from '@mypharma/api-core'
import { ObjectId } from 'bson'

export async function getCities(tenant: string) {
  const deliveryFees = await DeliveryFeeRepository.repo<DeliveryFeeRepository>(tenant).find({})
  const neighborhoods = deliveryFees.map(v => v.neighborhood)
  const cities = []

  neighborhoods.forEach(v => {
    if (!cities.find(c => c._id === v.city._id) && typeof v.city === 'object') {
      cities.push(v.city)
    }
  })

  return cities.map(v => {
    return {
      ...v,
      neighborhoods: neighborhoods.filter(n => n.city._id === v._id)
    }
  })
}

export function getSchedule(tenant: string) {
  return DeliveryScheduleRepository.repo<DeliveryScheduleRepository>(
    tenant
  ).find({})
}

export function getDeliveryFee(tenant: string, id?: string) {
  const where = {}
  
  if (id) {
    where['neighborhood._id'] = new ObjectId(id)
  }
  return DeliveryFeeRepository.repo<DeliveryFeeRepository>(tenant).find({ 
    where, 
    order: { feePrice: -1, minimumPurchase: -1  }
  })
}

export function getRegions(tenant: string, neighborhood: string) {
  if (!neighborhood) {
    return DeliveryFeeRepository.repo<DeliveryFeeRepository>(tenant).find({})
  }
  return DeliveryFeeRepository.repo<DeliveryFeeRepository>(tenant).find({
    where: {
      neighborhood: {
        _id: neighborhood,
      },
    },
    order: { feePrice: -1 }
  })
}
