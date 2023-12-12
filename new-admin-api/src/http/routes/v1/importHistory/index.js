const router = require('express').Router()
const { paginationParser } = require('myp-admin/helpers')
const { Mongo: { getModelByTenant } } = require('myp-admin/database')
const moment = require('moment')

router.get('/imports/:id?', async (req, res) => {
  try {
    const ImportHistorySchema = getModelByTenant(req.tenant, 'ImportHistorySchema')
    const { id, page = 1, limit = 20 } = req.params
    const { search, createdAt = null } = req.query

    if (id) {
      const history = await ImportHistorySchema.findById(id)

      if (!history) {
        return res.status(404).json({
          error: 'import_detail_not_found'
        })
      }

      return res.json({
        history
      })
    }

    const paginationOptions = {
      page,
      limit,
      sort: { createdAt: -1  },
      select: ['_id', 'total', 'failures', 'processed', 'module', 'status', 'createdAt']
    }

    const filters = {
      module: new RegExp(search, 'gi')
    }
    createdAt ? filters['createdAt'] = {
      $gte: moment(createdAt).startOf('day').toDate(),
      $lt: moment(createdAt).endOf('day').toDate()
    } : ''

    const pagination = await ImportHistorySchema.paginate(filters, paginationOptions);

    return res.json(paginationParser('importHistory', pagination));

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: 'internal_server_error'
    })
  }
})

router.delete('/:id', async (req, res) => {
  const Product = getModelByTenant(req.tenant, 'ProductSchema')
  const ImportHistorySchema = getModelByTenant(req.tenant, 'ImportHistorySchema')
  const ShowCaseSchema = getModelByTenant(req.tenant, 'ShowCaseSchema')
  const { id } = req.params

  try {
    const history = await ImportHistorySchema.findById(id)

    if (!history) {
      return res.status(404).json({
        error: 'import_not_found'
      })
    }

    const Eans = history.importData.filter(x => x.action === 'undo').map(item => item.EAN)

    if (history.module === 'product') {
      await Product.deleteMany({ EAN: { $in: Eans } })

      await ShowCaseSchema.updateMany(
        { 'products.product.EAN': { $in: Eans } },
        { $pull: { 'products': { 'product.EAN': { $in: Eans } } } }
      )

    } else {
      await Product.updateMany(
        { EAN: { $in: Eans } },
        { $set: { specials: [] } }
      )

      await ShowCaseSchema.updateMany(
        { 'products.product.EAN': { $in: Eans } },
        { $set: { 'products.$[element].product.specials': [] } },
        {
          arrayFilters: [
            { 'element.product.EAN': { $in: Eans } },
          ],
          multi: true,
        }
      )
    }

    await history.delete()

    return res.json({
      deletedId: id
    })


  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: 'internal_server_error'
    })
  }
})

module.exports = router
