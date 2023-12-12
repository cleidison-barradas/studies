const { Pluggto } = require("myp-admin/services/ErpOrdersService/PluggtoService")
const EpharmaService = require('myp-admin/services/ErpOrdersService/EpharmaService')

const isValidShippingData = (shipping_data) => {
    if (!shipping_data) return false
    if (!shipping_data.shippingCompany || shipping_data.shippingCompany.length == 0) return false
    if (!shipping_data.shippingMethod || shipping_data.shippingMethod.length == 0) return false
    if (!shipping_data.trackCode || shipping_data.trackCode.length == 0) return false
    if (!shipping_data.trackUrl || shipping_data.trackUrl.length == 0) return false
    return true
}

const sendNfeToExternalApi = async (nfe_data, tenant, order, settings, pbmOrder = null) => {

    try {
        if (pbmOrder) {
            const epharmaService = new EpharmaService({ settings })
            const accessToken = await epharmaService.authenticate()

            const pbmResponse = await epharmaService.createPbmSale({
                accessToken,
                items: pbmOrder.items,
                fiscalDocument: pbmOrder.fiscalDocument,
                authorizationId: Number(pbmOrder.authorizationId),
                storeSequenceId: Number(pbmOrder.storeSequenceId),
                elegibilityToken: pbmOrder.elegibilityToken,
            })

            if (pbmResponse && pbmResponse.data.error) {
                console.log(pbmResponse.data)
                throw new Error('failure_on_send_external')
            }

            return pbmResponse.data


        } else {
            const { prefix } = order
            const externalId = order.externalMarketplace.externalId
            const external_shipping_id = order.shippingData.external_shipping_id

            if (prefix === "Pluggto") {
                const pluggto = new Pluggto()
                await pluggto.setup(tenant, externalId, external_shipping_id)
                await pluggto.authentication()
                await pluggto.putNfeData(nfe_data)
            }
        }

    } catch (error) {
        console.log(error)

        throw new Error('failure_on_send_external')

    }

}

const sendShippingToExternalApi = async (shipping_data, tenant, order) => {
    const { prefix } = order
    const externalId = order.externalMarketplace.externalId
    const external_shipping_id = order.shippingData.external_shipping_id
    console.log(order.shippingData)

    if (prefix === "Pluggto") {
        const pluggto = new Pluggto()
        await pluggto.setup(tenant, externalId, external_shipping_id)
        await pluggto.authentication()
        await pluggto.putShippingData(shipping_data)
    }
}

module.exports = { isValidShippingData, sendNfeToExternalApi, sendShippingToExternalApi }