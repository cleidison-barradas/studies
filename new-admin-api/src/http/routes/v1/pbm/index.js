const router = require('express').Router()
const { Models: { PbmOrderSchema } } = require('myp-admin/database/mongo')
const PbmGetOrderService = require('./services/PbmGetPreOrderService')

router.get('/:orderId', async (req, res) => {

  try {
    const { orderId } = req.params
    const pbmGetOrderService = new PbmGetOrderService(PbmOrderSchema.Model())

    const preOrder = await pbmGetOrderService.getPreOrder(orderId)

    return res.json({
      preOrder
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: error.message
    })
  }
})



module.exports = router