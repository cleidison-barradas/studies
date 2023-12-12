import { Get, JsonController, Res } from '@mypharma/api-core'
import { Response } from 'express'
import CategoryService from './category.service'

@JsonController('/v1/category')
export default class CategoryController {
  @Get()
  async getCategories(@Res() response: Response): Promise<unknown> {
    try {
      const categoryService = new CategoryService()
      const categories = await categoryService.getCategories()

      return { categories }
    } catch (error) {
      return response.status(500).json({ error: error.message })
    }
  }
}
