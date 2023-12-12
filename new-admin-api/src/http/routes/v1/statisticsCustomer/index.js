const router = require('express').Router();
const { objectIdValidation } = require('../../../middlewares');
const { getModelByTenant } = require('myp-admin/database/mongo');

router.get('/', objectIdValidation, async (req, res) => {
  try {
    const Customer = getModelByTenant(req.tenant, 'CustomerSchema')

    const customers = await Customer.countDocuments({ status: true });

    return res.json({ customers })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: 'internal_sever_error'
    })
  }
});

module.exports = router;
