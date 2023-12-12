import { Customer, ObjectID, Store } from "@mypharma/api-core";

export const getStoreContent = (store: Store, customer: Customer) => {
  const name = store.name
  const email = customer.email

  const storeEmail = String(store.settings['config_email'])
  const storeId = new ObjectID(store._id.toString())
  const color = String(store.settings['config_navbar_color'])
  const checkout = new URL('/checkout', store.url).href
  const unsubscribe = new URL(`/unsubscribe/${email}`, store.url).href

  const phone = String(store.settings['config_phone']).replace(/\D/g, '')
  const whatsapp = String(store.settings['config_whatsapp_phone']).replace(/\D/g, '')


  return {
    name,
    email,
    phone,
    color,
    storeId,
    checkout,
    whatsapp,
    storeEmail,
    unsubscribe,
  }
}