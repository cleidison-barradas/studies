const router = require('express').Router();

const { paginationParser } = require('myp-admin/helpers')
const { objectIdValidation } = require('myp-admin/http/middlewares')

const { Mongo: { getModelByTenant } } = require('myp-admin/database');
const { ObjectId } = require('mongodb');

router.use((req, res, next) => {
  req.models = {
    historyOrder: getModelByTenant(req.tenant, 'HistoryOrderSchema'),
  }
  next()
})

router.get('/:id?', objectIdValidation, async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20, order = null } = req.query;
    const History = req.models.historyOrder
    const filters = {}

    order ? filters["order._id"] = ObjectId(order) : {}
    
    if (id) {
      const historyOrder = await History.findById(id)

      if (!historyOrder) {
        return res.status(404).json({
          error: 'history_not_found'
        });
      }

      return res.json({
        historyOrder
      })
    }

    const paginationOptions = {
      page,
      limit,
      sort: 'createdAt'
    };

    const pagination = await History.paginate(filters, paginationOptions);

    return res.json(paginationParser('historyOrders', pagination));

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: 'internal_server_error'
    })

  }
})

module.exports = router;
