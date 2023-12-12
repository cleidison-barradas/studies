import { create, ApisauceInstance } from 'apisauce'
import notificatorConfig from '../config/popup-notificator'

class NotificationApi {
  private NewApi: ApisauceInstance
  constructor() {
    this.NewApi = create({
      baseURL: notificatorConfig.newPopoup,
    })
  }

  async notify(orderId: string, storeId: string, tenant: string) {
    try {
      await this.NewApi.post(`/v1/notification/${tenant}`, { orderId, storeId })

    } catch (error) {
      console.error(error)
    }
  }
}
export default new NotificationApi()
