import path from 'path'
import CreateImportService from './UploadGetProductXlsDataService'

describe('Testing import product function', () => {

  it('should be able process xls product', async () => {
    const Service = new CreateImportService()
    const filePath = path.resolve(__dirname, '..', '..', '..', '..', 'tmp', 'products.xls')
    const type = 'product'

    const { products } = await Service.getProductXlsData({ filePath, tenant: 'test' })

    expect(products instanceof Array)

    const product = products.pop()

    expect(product).toHaveProperty('ean')

    expect(product).toHaveProperty('preco')

    expect(product).toHaveProperty('estoque')
  })
})
