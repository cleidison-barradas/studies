import { StoreRepository } from '@mypharma/api-core'

export default async function turnCpfRequired(tenant: string) {
  const store = await StoreRepository.repo().findOne({ where: { tenant } })

  if (!store) {
    throw new Error('store_not_found')
  }
  const { config_cpf_checkout = false } = store.settings

  if (!config_cpf_checkout) {
    await StoreRepository.repo().updateOne(
      { tenant },
      {
        $set: {
          'settings.config_cpf_checkout': true
        }
      })

    console.log('Turning CPF required')
  }
}