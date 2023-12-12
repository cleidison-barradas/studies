const router = require('express').Router();
const { ObjectId } = require('bson');
const { getModelByTenant } = require('myp-admin/database/mongo')

// Delete Many orders
router.post('/delete', async (req, res) => {
  try {
    const OrderSchema = getModelByTenant(req.tenant, 'OrderSchema')
    const { orders = undefined } = req.body

    if (orders && orders instanceof Array) {
      const ids = orders.map(id => new ObjectId(id))

      await OrderSchema.deleteMany({ _id: { $in: ids } })
    }

    const deletedId = orders.toString()

    return res.json({
      deletedId
    })

  } catch (error) {
    console.log(error)
    return res.json({
      error: 'internal_server_error'
    })
  }

})

module.exports = router;
