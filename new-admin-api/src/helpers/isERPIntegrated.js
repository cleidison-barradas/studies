const { ObjectId } = require('bson')
// function to find API ERPS integrations only
// used by trier queue AND for information of CPF in checkout
const { Models: { IntegrationUserErpSchema }, getModelByTenant } = require('../database/mongo')

const isERPIntegrated = async (integrationArray = [], tenant) => {
    // you pass an array with the correct name of the erp integration and then put into the find query
    const Schema = IntegrationUserErpSchema.Model()
    const Integrations = getModelByTenant('integration', 'IntegrationErpSchema')
    const validIntegrations = await Integrations.find({ name: { $in: [integrationArray[0]] } })

    // tenant = 'novamypharma' // enable it if you want to test trier in alpha

    if (validIntegrations.length > 0) {
        const erpId = validIntegrations[0]._id

        const isERP = await Schema.find({ erpId: { $in: erpId }, "store.tenant": tenant })

        return isERP
    }

    return []
}

module.exports = { isERPIntegrated }
