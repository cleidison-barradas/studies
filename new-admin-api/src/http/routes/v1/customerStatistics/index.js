const router = require('express').Router();
const { ObjectID } = require('bson')

const { objectIdValidation } = require('../../../middlewares');
const { Mongo: { getModelByTenant } } = require('myp-admin/database')

router.get('/order/products/:id?', objectIdValidation, async (req, res) => {
  const Order = getModelByTenant(req.tenant, 'OrderSchema')
  const Customer = getModelByTenant(req.tenant, 'CustomerSchema')

  try {
    const { id } = req.params;

    const customer = await Customer.findById(id);

    if (!customer) {
      return res.status(404).json({ error: 'customer_not_found' });
    }

    const orders = await Order.find({
      $or: [
        { "customer._id": customer._id.toString() },
        { "customer._id": new ObjectID(customer._id.toString()) }
      ]
    })

    const products = []

    orders.map(order => {
      products.push(...order.products)
    })

    return res.json({ products })

  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

module.exports = router;
