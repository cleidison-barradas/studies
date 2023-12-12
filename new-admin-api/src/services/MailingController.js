const { remarketing } = require('../sendEmail')
const { getModelByTenant } = require('myp-admin/database/mongo')
const { AWS_S3_URL } = process.env

module.exports = class MailingController {
    constructor(tenant) {
        this.tenant = tenant
    }

    async findSubscribedCustomers() {
        const Customer = getModelByTenant(this.tenant, 'CustomerSchema')

        return Customer.find().where('subscribed').ne(false).select(['email', 'firstname', 'fullname'])
    }

    async notifyCustomers(personalizations, templateId, from) {
        return remarketing({ personalizations, templateId, from })
    }

    cupomMailFactory({ store, customers, discount, code }) {
        const {
            url,
            name,
            settings: { config_logo, config_address, config_store_number, config_store_city, config_navbar_color },
        } = store

        const storeAddress = `${config_address},${config_store_number} - ${config_store_city}`

        return customers.map(({ email, firstname, fullname }) => ({
            to: [{ email, name: fullname }],
            dynamicTemplateData: {
                firstname: firstname,
                storeUrl: url,
                storeLogo: `${AWS_S3_URL}${config_logo}`,
                storeName: name,
                storeAddress: storeAddress,
                discount,
                storeColor: config_navbar_color,
                code,
                customerEmail: email,
                subject: `${firstname}, CUPOM de desconto para você!`,
            },
        }))
    }
}
