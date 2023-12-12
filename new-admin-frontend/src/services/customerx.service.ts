import { CustomerxToken } from '../config'

class CustomerxService {
  cx = (window as any).cx
  trackingStarted: boolean = false

  start(external_id_client: string, email: string) {
    this.cx.survey('authorize', CustomerxToken)
    this.cx.survey('identify', { external_id_client, email })
    this.cx.survey('start', 'nps')
  }

  stop() {
    this.cx.survey('stop', 'nps')
    this.cx.survey('clear', 'nps', 'all')
  }

  startTracking(hash: string) {
    try {
      this.cx.tracking('authorize', hash)
      this.trackingStarted = true
    } catch (error) {
      console.log(error)
    }
  }

  sendUserTracking() {
    if (!this.trackingStarted) return
    this.cx.tracking('send', 'user')
  }

  trackingScreen() {
    if (!this.trackingStarted) return
    this.cx.tracking('send', 'screen')
  }

  trackingAction(action: string) {
    if (!this.trackingStarted) return
    this.cx.tracking('send', 'action', action)
  }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default new CustomerxService()
