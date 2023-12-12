const router = require('express').Router()
const moment = require('moment')

const { objectIdValidation } = require('myp-admin/http/middlewares')
const { paginationParser, updateFieldsParser } = require('myp-admin/helpers')

const {
    Mongo: { getModelByTenant },
} = require('myp-admin/database')
const CustomerController = require('./controllers/CustomerController')

const customerController = new CustomerController();

router.get('/:id?', objectIdValidation, async (req, res) => {
    const { id } = req.params
    const {
        page = 1,
        limit = 20,
        name = '',
        email = '',
        phone = '',
        createdAt,
        search,
        status,
        advancedFilter
    } = req.query

    try {
        const Customer = getModelByTenant(req.tenant, 'CustomerSchema')
        const Order = getModelByTenant(req.tenant, 'OrderSchema')

        if (id) {
            const customer = await Customer.findById(id)

            if (!customer) {
                return res.status(404).json({ error: 'customer not found' })
            }

            return res.json({ customer })
        }

        const paginationOptions = {
            page,
            limit,
            sort: 'fullName',
        }

        const filter = {
            $or: [
                { firstname: new RegExp(name.trim(), 'gi') },
                { lastname: new RegExp(name.trim(), 'gi') },
            ],
            email: { $regex: email },
            phone: { $regex: phone },
        }

        createdAt
            ? (filter['createdAt'] = {
                  $gte: moment(createdAt).startOf('day').toString(),
                  $lte: moment(createdAt).endOf('day').toString(),
              })
            : ''

        search
            ? (filter['$or'] = [
                  { firstname: new RegExp(search.trim(), 'gi') },
                  { lastname: new RegExp(search.trim(), 'gi') },
                  { email: new RegExp(search.trim(), 'gi') },
                  { phone: new RegExp(search.trim(), 'gi') },
              ])
            : ''

        status ? (filter['status'] = status) : ''

        if(advancedFilter === 'mostOrders'){
            paginationOptions['sort'] = undefined

            const orderAggregate = await Order.aggregate([
                {
                    $match : {
                        'customer._id' : {$ne : null}
                    }
                },
                {
                    $group : {
                        _id : '$customer._id',
                        count : {$sum : 1}
                    }
                }
            ])

            filter['_id'] = {
                $in :orderAggregate.sort((a,b)=> a.count > b.count ? -1 : 1) 
            }
        }
        if(advancedFilter === "continuousMedicamentsOrders"){
            paginationOptions['sort'] = undefined

            const orderAggregate = await Order.aggregate([
                {
                    $match : {
                        'customer._id' : {$ne : null},
                        'products.product.continuousUse' : {$eq : true},
                        'deleted' : {$ne:true}
                    }
                },
                {
                    $group : {
                        _id : '$customer._id',
                        count : {$sum : 1}
                    }
                }
            ])

            filter['_id'] = {
                $in :orderAggregate.sort((a,b)=> a.count > b.count ? -1 : 1) 
            }

        }

        const pagination = await Customer.paginate(filter, paginationOptions)

        return res.json(paginationParser('customers', pagination))
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: 'internal_server_error',
        })
    }
})

router.post('/:id', objectIdValidation, async (req, res) => {
    try {
        const { id } = req.params
        const Customer = getModelByTenant(req.tenant, 'CustomerSchema')
        const {
            external_id,
            full_name,
            email,
            phone,
            cpf,
            password,
            passwordSalt,
            status,
            addresses,
        } = req.body
        const customerExists = await Customer.findById(id)

        if (!customerExists) {
            return res.status(404).json({ error: 'customer_not_found' })
        }
        const updateFields = updateFieldsParser({
            external_id,
            full_name,
            email,
            phone,
            cpf,
            password,
            passwordSalt,
            status,
            addresses,
        })
        await customerExists.updateOne({
            ...updateFields,
            updatedAt: Date.now(),
        })

        const customer = await Customer.findById(id)

        return res.json({ customer })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: 'internal_server_error',
        })
    }
})

router.post('/createWithEmail', customerController.createWithEmail);

router.put('/', async (req, res) => {
    try {
        const Customer = getModelByTenant(req.tenant, 'CustomerSchema')
        const Address = getModelByTenant(req.tenant, 'PublicAddressSchema')
        let {
            firstname,
            lastname,
            email,
            phone,
            cpf,
            password,
            passwordSalt,
            status,
            addresses,
        } = req.body

        addresses = await Address.find({ _id: { $in: addresses } })

        const customer = await Customer.create({
            firstname,
            lastname,
            email,
            phone,
            cpf,
            password,
            passwordSalt,
            status,
            addresses,
        })
        return res.json({ customer })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: 'internal_server_error',
        })
    }
})

router.delete('/:_id?', objectIdValidation, async (req, res) => {
    try {
        const { _id } = req.params
        const Customer = getModelByTenant(req.tenant, 'CustomerSchema')
        const { ids } = req.query

        if (_id) {
            await Customer.deleteOne({ _id })
            return res.json({ deletedId: _id })
        }

        if (ids && ids.length > 0) {
            await Customer.deleteMany({ _id: { $in: ids } })

            return res.json({ deletedId: ids })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: 'internal_server_error',
        })
    }
})

module.exports = router
