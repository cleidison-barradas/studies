const router = require('express').Router();
const moment = require('moment');

const { objectIdValidation } = require('../../../middlewares');

const { getModelByTenant, Models: { StatusOrderSchema } } = require('myp-admin/database/mongo');

router.use((req, res, next) => {
  req.models = {
    order: getModelByTenant(req.tenant, 'OrderSchema'),
    customer: getModelByTenant(req.tenant, 'CustomerSchema'),
  }
  next()
})

router.get('/', objectIdValidation, async (req, res) => {
  try {
    const { initialDate, finalDate } = req.query;
    const filters = {};

    const Order = req.models.order;
    const Status = StatusOrderSchema.Model()
    const Customer = req.models.customer

    if(!initialDate && !finalDate){
      return res.status(400).json({
        error : 'empty_final_and_initial_date'
      })
    }

    const statistics = {
      totalOrder: 0,
      orderAccept: 0,
      orderReject: 0,
      orderPending: 0,
      valueSold: 0,
      totalCustomers: 0
    };

    if (initialDate && finalDate) {
      filters.createdAt = { $gte: initialDate, $lte: finalDate }
    }

    const totalCustomers = await Customer.countDocuments(filters)
    if (totalCustomers) {
      statistics['totalCustomers'] = totalCustomers
    }

    const order = await Order.find(filters);
    const [accepted, pending, rejected] = Status.schema.path('type').enumValues

    if (!order) {
      return res.status(404).json({ error: 'store orders not found' });
    }
  
    order.forEach(order => {
      if (order.statusOrder.type === accepted) {
        statistics.orderAccept += 1;
      }
      if (order.statusOrder.type === rejected) {
        statistics.orderReject += 1;
      }
      if (order.statusOrder.type === pending) {
        statistics.orderPending += 1;
      }
      statistics.totalOrder++;
      statistics.valueSold += order.totalOrder;
    });

    return res.json({ statistics })

  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'internal_server_error' });
  }
});

module.exports = router;
