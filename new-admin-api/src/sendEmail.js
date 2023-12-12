const logger = require('./utils/logger')
const sgMail = require('@sendgrid/mail')
const { sendgrid } = require('myp-admin/config')
/**
 *
 * @param {Object} options
 * @param {String} options.subject
 * @param {String} options.destination
 * @param {String} options.content
 * @param {Boolean} options.isContentHtml
 */

module.exports = {
    sendMail({ fromName = 'noreply', subject, destination, content, isContentHtml = false }) {
        const { user, key } = sendgrid

        // Does credentials were informed?
        if (key.length === 0 || user.length === 0) {
            logger('Could not send email because sendgrid credentials were not found.', undefined, 'warn')
            return false
        }

        sgMail.setApiKey(key)

        let message = {
            to: destination,
            from: {
                email: user,
                name: fromName,
            },
            subject,
        }

        if (isContentHtml) {
            message = {
                ...message,
                html: content,
            }
        } else {
            message = {
                ...message,
                content,
            }
        }

        return sgMail.send(message)
    },

    remarketing(data) {
        const { user, key } = sendgrid

        if (!key || !user) {
            logger('Could not send email because sendgrid credentials were not found.', undefined, 'warn')
            return false
        }

        sgMail.setApiKey(key)

        return sgMail.send({ ...data })
    },
}
