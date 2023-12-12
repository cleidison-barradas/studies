import * as sgMail from '@sendgrid/mail'
import { MailDataRequired } from '@sendgrid/mail'
import sendgridConfig from '../../config/sendgrid'

class SendGridPlugin {
  private bulkSendEmails: MailDataRequired[] = []

  constructor() {
    this.init()
  }

  private init() {

    if (sendgridConfig.sendGridKey.length <= 0 || sendgridConfig.sendGridUser.length <= 0) {

      throw new Error('missing_sendgrid_credentials')
    }

    sgMail.setApiKey(sendgridConfig.sendGridKey)
  }

  public getBulkSendEmails() {

    return this.bulkSendEmails
  }

  public setBulkSendEmails(data: MailDataRequired[]) {

    this.bulkSendEmails.push(...data)
  }

  public async sendMail() {
    try {

      if (this.bulkSendEmails.length > 0) {
        await sgMail.send(this.bulkSendEmails)
        this.bulkSendEmails = []
      }

    } catch (error) {
      this.bulkSendEmails = []
      console.log(error.response.body)
    }
  }
}

export default SendGridPlugin