import { Customer, Store } from "@mypharma/api-core";
import IntervalDays from "../../../interfaces/interval_days";

export const getMissYouContent = (customer: Customer, store: Store, content: IntervalDays) => {
  const storeName = store.name
  const customerName = customer.fullName
  const config_phone = store.settings['config_phone'].replace(/\D/g, '')
  const config_whatsapp_phone = store.settings['config_whatsapp_phone'].replace(/\D/g, '')

  const title = content.title.replace('{name}', customerName).replace('{storeName}', storeName)
  const subtitle = content.subTitle.replace('{name}', customerName).replace('{storeName}', storeName)
  const message = content.message.replace('{storeWhatsapp}', config_whatsapp_phone).replace('{storePhone}', config_phone).replace('{storeName}', storeName)


  return {
    title,
    message,
    subtitle,
  }
}