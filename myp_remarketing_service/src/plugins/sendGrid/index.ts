import * as sgMail from '@sendgrid/mail'
import { MailDataRequired } from '@sendgrid/mail'

const { SENDGRID_API_KEY } = process.env

class Mail {
  private bulkSendEmails: MailDataRequired[] = []

  constructor() {
    this.init()
  }

  private init() {

    if (!SENDGRID_API_KEY || SENDGRID_API_KEY.length <= 0) {

      throw new Error('missing_sendgrid_credential')
    }

    sgMail.setApiKey(SENDGRID_API_KEY)
  }

  public getBulkSendEmails() {

    return this.bulkSendEmails
  }

  public setBulkSendEmails(data: MailDataRequired[]) {

    this.bulkSendEmails.push(...data)
  }

  public async SendMail() {
    try {

      if (this.bulkSendEmails.length > 0) {

        await sgMail.send(this.bulkSendEmails)
      }

      this.bulkSendEmails = []

    } catch (error) {
      this.bulkSendEmails = []
      console.log('err ->', error)
    }
  }
}

export default Mail