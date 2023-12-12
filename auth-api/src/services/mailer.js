const sgMail = require("@sendgrid/mail");
const {
  SENDGRID_API_KEY,
} = process.env

sgMail.setApiKey(SENDGRID_API_KEY);

const templates = {
  password_recover: 'd-4c42a2b28fcb4cf8adaa5db6ee048ba7'
}

/*
  * Data needed to send our recover email
  * @param {Object} data - Our data object
  * @param {string} data.receiver - The user email 
  * @param {string} data.userName - The user Name
  * @param {string} data.recoverUrl - The url with the userId and Recover token
*/
module.exports = {
  async sendRecoverEmail(data) {
    const { receiver, username, recoverUrl,expires,from } = data

    const msg = {
      to: receiver,
      from,
      templateId: templates.password_recover,
      dynamic_template_data: {
        username,
        recoverUrl,
        expires
      },
      hideWarnings: true // now the warning won't be logged
    }

    await sgMail.send(msg, (error, result) => {
      if (error)  {
        console.log(error.response.body.errors)
        throw new Error(error.message)  
      }
      else return result   
    })

  }
}