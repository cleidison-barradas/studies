//const XLSX = require("xlsx");
const XLSX = require('xlsx-js-style')
const router = require('express').Router()
const json2csv = require('../../../../helpers/json2csv')
const { getModelByTenant } = require('myp-admin/database/mongo')
const { put } = require('../../../../services/aws')
const { startOfDay, endOfDay, format } = require('date-fns')
const { orders2XLSX } = require('./orders2XLSX')
const {
    normalizeCustomer,
} = require('../../../../helpers/normalize')
const { checkReportLinks } = require('../../../../utils/ifoodReportLinks');

router.get('/customer', async (req, res) => {
    try {
        const { startAt, endAt } = req.query

        const CustomerSchema = getModelByTenant(req.tenant, 'CustomerSchema')

        const filters = {}

        if (startAt && endAt) {
            filters['createdAt'] = {
                $gte: startOfDay(new Date(startAt)),
                $lte: endOfDay(new Date(endAt)),
            }
        }

        const customers = await CustomerSchema.find(filters).sort({
            fullName: 'asc',
        })

        if (customers.length === 0) {
            return res.status(404).send({
                error: 'customers_not_found',
            })
        }

        const content = json2csv(normalizeCustomer(customers))

        const { Location } = await put(`${req.tenant}/reports/clientes.csv`, {
            content,
        })

        return res.json({ report: Location })
    } catch (error) {
        console.log(error)
        return res.status(400).json({ error: error.message })
    }
})

router.get('/order', async (req, res) => {
    try {
        const { startAt = null, endAt = null, prefix = null, orderStatus = null } = req.query
        const OrderSchema = getModelByTenant(req.tenant, 'OrderSchema')

        const filters = {
            customer: { $ne: null } //prevent error
        }

        switch (prefix) {
            case ('iFood'):
                filters['prefix'] = prefix
                break;
            case ('mypharma'):
                filters['prefix'] = { $ne: 'iFood' }
                break;
            default:
        }




        if (orderStatus && orderStatus.length > 0) {
            const parsedStatusArray = orderStatus.map(str => JSON.parse(str)) //parse string to objects
            filters['statusOrder.type'] = { $in: parsedStatusArray.map(filter => filter.value) }
        }

        var startDate = 'null'
        var endDate = 'null'
        if (startAt && endAt) {
            filters['createdAt'] = {
                $gte: startOfDay(new Date(startAt)),
                $lte: endOfDay(new Date(endAt)),
            }
        }
        else if(startAt){
            filters['createdAt'] = {
                $gte: startOfDay(new Date(startAt)),
            }
        }
        else if(endAt){
            filters['createdAt'] = {
                $lte: endOfDay(new Date(endAt)),
            }
        }

        if (startAt) startDate = format(new Date(startAt), 'dd/MM/yyyy')
        if (endAt) endDate = format(new Date(endAt), 'dd/MM/yyyy')

        const orders = await OrderSchema.find(filters).sort({ createdAt: 'asc' })

        if (orders.length === 0) {
            return res.status(400).send({
                error: 'orders_not_found',
            })
        }

        const OrdersWorkbook = orders2XLSX(orders, startDate, endDate)
        const buffer = XLSX.write(OrdersWorkbook, { type: 'buffer', bookType: 'xlsx' })

        const { Location: report } = await put(`${req.tenant}/reports/pedidos.xlsx`, {
            content: buffer
        })

        return res.json({
            report
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: 'internal_server_error'
        })
    }
})

router.get('/ifood', async (req, res) => {
    try {
        const reports = checkReportLinks(req.tenant);

        return res.json({ ifoodReports: reports })
    }
    catch (error) {
        return res.status(400).json({ error: error.message })
    }
})

module.exports = router
