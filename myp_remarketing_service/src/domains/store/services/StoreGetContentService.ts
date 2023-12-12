import { Customer, ObjectID, Store } from "@mypharma/api-core"

interface StoreGetContentServiceDTO {
  store: Store
  customer?: Customer
}

class StoreGetContentService {
  constructor(private repository?: any) { }

  public async getStoreContent({ store, customer = null }: StoreGetContentServiceDTO) {
    let unsubscribe: string | null = null
    let customerName: string | null = null

    const storeName = store.name
    const storeId = new ObjectID(store._id.toString())
    const checkout = new URL('/checkout', store.url).href
    const storeEmail = String(store.settings['config_email'])
    const color = String(store.settings['config_navbar_color'])
    const phone = String(store.settings['config_phone']).replace(/\D/g, '')
    const whatsapp = String(store.settings['config_whatsapp_phone']).replace(/\D/g, '')

    if (customer) {

      customerName = customer.fullName
      unsubscribe = new URL(`/unsubscribe/${customer.email}`, store.url).href
    }

    if (!color || !phone || !storeId || !whatsapp || !checkout || !storeName || !storeEmail) {

      throw new Error('missing_store_configs')
    }

    return {
      color,
      phone,
      storeId,
      whatsapp,
      checkout,
      storeName,
      storeEmail,
      unsubscribe,
      customerName
    }
  }
}

export default StoreGetContentService