import { Store } from '@mypharma/api-core'

export function getSenderOrigin(store: Store) {
  const phone = String(store.settings['config_phone']).replace(/\D+/g, '')
  const email = String(store.settings['config_email'])
  const company_document = String(store.settings['config_cnpj']).replace(/\D+/g, '')
  const number = Number(String(store.settings['config_store_number']).replace(/\D+/g, ''))
  const postal_code = String(store.settings['config_cep']).replace(/\D+/g, '')
  const city = String(store.settings['config_store_city'])
  const district = String(store.settings['config_store_city'])
  const address = String(store.settings['config_address'])

  return {
    note: '',
    phone,
    email,
    city,
    number,
    address,
    district,
    postal_code,
    name: store.name,
    country_id: 'BR',
    company_document,
  }

}
