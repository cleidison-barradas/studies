const router = require('express').Router()

// MomentJS
const moment = require('moment')

// Helper
const { getIntegrationInfo } = require('myp-admin/helpers/getIntegrationInfo')

const { objectIdValidation } = require('myp-admin/http/middlewares')

const {
    BillboardSchema,
    StoreSchema,
} = require('myp-admin/database/mongo/models')

router.get('/', objectIdValidation, async (req, res) => {
    const BillboardModel = BillboardSchema.Model()
    const StoreModel = StoreSchema.Model()

    try {
        const { tenant } = req
        const { _id } = await StoreModel.findOne({ tenant }).select('_id')

        const filters = {
            startAt: {
                $lte: new Date(),
            },
            endAt: {
                $gte: new Date(),
            },
            $or: [
                {
                    stores: _id,
                },
                {
                    stores: [],
                },
            ],
            active: true,
        }

        const billboard = await BillboardModel.find(filters)

        // Get integration info
        const integration = await getIntegrationInfo(_id)

        if (integration && ['warning', 'problem'].includes(integration.status)) {
            billboard.push({
                title: 'Problemas com a integração',
                message: `Última atividade da sua integração foi em ${moment(integration.lastSeen).calendar({ sameElse: 'DD/MM/YYYY HH:mm' })}, portanto a mesma pode apresentar problemas. Por favor entrar em contato com o suporte da MyPharma.`,
                type: integration.status === 'problem' ? 'error' : 'warning'
            })
        }

        return res.json({ billboard })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: 'internal_server_error',
        })
    }
})

module.exports = router
