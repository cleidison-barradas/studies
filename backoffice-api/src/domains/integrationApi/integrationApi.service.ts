import {
  IntegrationErpRepository,
  IntegrationUserErpRepository,
  ORM,
  ObjectID,
  StoreRepository,
  IntegrationUserErp
} from '@mypharma/api-core'
import { IntegrationData } from './interfaces/integrationApiInterface'

const getIntegrationApiData = async (id: string): Promise<IntegrationUserErp> => {
  await ORM.setup(null, undefined)
  let integrationData: IntegrationUserErp | null = null

  const integration = await IntegrationErpRepository.repo('integration').findOne({
    where: {
      name: RegExp('Trier', 'i')
    }
  })

  if (integration) {

    const trier_data = await IntegrationUserErpRepository.repo().find({
      where: {
        erpId: new ObjectID(integration._id.toString())
      }
    })

    if (trier_data.length > 0) {
      trier_data.forEach(data => {
        const hasIntegration = data.store.filter(_store => _store._id.toString() === id).length > 0

        if (hasIntegration) {

          integrationData = data
        }

      })
    }
  }

  return integrationData
}

const updateIntegrationData = async (_id: string, integrationData: IntegrationData, currentIntegrationData: any): Promise<void> => {
  const { token, baseUrl } = integrationData.trierData

  await IntegrationUserErpRepository.repo().updateOne(
    { _id: new ObjectID(currentIntegrationData._id) },
    {
      $set: {
        token,
        baseUrl
      }
    })
}

const createIntegrationData = async (_id: string, integrationData: IntegrationData) => {
  console.log('Creating!')

  await ORM.setup(null, 'integration')
  const erp = await IntegrationErpRepository.repo('integration').findOne({ name: 'Trier' })
  const { token, baseUrl } = integrationData.trierData

  await ORM.setup(null, undefined)
  const store = await StoreRepository.repo().findById(_id)
  const trier_integration = {
    userName: 'trier',
    email: store.settings.config_email,
    password: 'no password for trier integration',
    token,
    baseUrl,
    store: [store],
    admin: false,
    erpId: [new ObjectID(erp._id.toString())],
    createdAt: new Date(),
    updatedAt: new Date()
  }

  await IntegrationUserErpRepository.repo().insertOne(trier_integration)
}

export { getIntegrationApiData, createIntegrationData, updateIntegrationData }
