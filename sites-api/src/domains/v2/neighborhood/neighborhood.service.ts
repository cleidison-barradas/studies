import { CityRepository, NeighborhoodRepository } from '@mypharma/api-core'
import { IRequest } from './interfaces/request'

export async function createNeighborhood(data: IRequest) {
  const { name, city, state, code } = data

  const cityObj = await CityRepository.repo().findOne({
    where: {
      name: { $regex: city.trim(), $options: 'gi' },
      'state.name': { $regex: state.trim(), $options: 'gi' },
      'state.code': { $regex: code.trim(), $options: 'gi' },
    },
  })

  const neighborhoodObj = {
    name,
    city: cityObj,
  }

  return NeighborhoodRepository.repo().save(neighborhoodObj)
}
