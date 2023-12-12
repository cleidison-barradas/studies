import { Manufacturer, ManufacturerRepository } from '@mypharma/api-core'

export default class ManufacturerService {
  async find(name: string): Promise<Manufacturer[]> {
    return ManufacturerRepository.repo().find({
      where: {
        name: new RegExp(name, 'gi'),
      },
      take: 20,
    })
  }
}
