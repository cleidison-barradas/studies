import path from 'path'
import CreateImportService from './CreateImportCustomerService'

describe('Testing import customer function', () => {

  it('should be able process xls customer', async () => {
    const service = new CreateImportService()
    const filePath = path.resolve(__dirname, '..', '..', '..', '..', 'tmp', 'client.xls')

    const { customers } = await service.execute({ filePath, tenant: 'teste' })

    const client = customers.pop()

    expect(client instanceof Array)

    expect(client).toHaveProperty('email')

    expect(client).toHaveProperty('name')

  })
})
