import { Category, CategoryRepository } from '@mypharma/api-core'
const { DATABASE_MASTER_NAME } = process.env

export default class CategoryService {
  async getCategories(): Promise<Category[]> {
    return CategoryRepository.repo(DATABASE_MASTER_NAME).find()
  }
}
