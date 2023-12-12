import { Store } from "@mypharma/api-core"
import adminConfig from "../../config/admin"
import { ObjectId } from "bson"

interface GetCustomerContentDTO {
  store: Store
  orderId: string
}

export const getStoreContent = ({ store, orderId }: GetCustomerContentDTO) => {

  const storeName = store.name
  const storeEmail = String(store.settings['config_email'])
  const storeId = new ObjectId(store._id.toString())
  const color = String(store.settings['config_secondary_color'])
  const background_color = String(store.settings['config_navbar_color'])
  const order = new URL(`/sale/${orderId}`, adminConfig.adminBaseUrl).href

  const phone = String(store.settings['config_phone']).replace(/\D/g, '')
  const whatsapp = String(store.settings['config_whatsapp_phone']).replace(/\D/g, '')

  return {
    color,
    order,
    phone,
    orderId,
    storeId,
    whatsapp,
    storeName,
    storeEmail,
    background_color
  }
}