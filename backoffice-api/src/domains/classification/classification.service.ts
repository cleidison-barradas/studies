import { ProductClassificationRepository } from '@mypharma/api-core'

class ClassificationService {
  async getProductClassification(end: number, start: number, query?: string) {
    let where: Record<any, any> = {}

    if (query) {
      where = {
        $or: [{ name: new RegExp(query, 'i') }],
      }
    }

    return ProductClassificationRepository.repo().find({
      where,
      take: start,
    })
  }
}

export default new ClassificationService()
