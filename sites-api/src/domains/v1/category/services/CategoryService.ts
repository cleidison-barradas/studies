import { CategoryRepository } from '@mypharma/api-core'

export default function getCategory(tenant: string) {
  return CategoryRepository.repo<CategoryRepository>(tenant).find({ where: {
    status: true
  } })
}
