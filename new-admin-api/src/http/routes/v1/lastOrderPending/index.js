const router = require('express').Router();
const moment = require('moment');
const { paginationParser } = require('../../../../helpers')
const { objectIdValidation } = require('../../../middlewares')
const { Mongo: { getModelByTenant } } = require('myp-admin/database')

router.get('/:id?', objectIdValidation, async (req, res) => {
  try {
    const LastOrders = getModelByTenant(req.tenant, 'OrderSchema')
    const { page = 1, limit = 20 } = req.query;
    const { id } = req.params;

    const today = moment().startOf('day');
    const day = new Date();
    day.setDate(day.getDate() - 3);

    filters = {
      statusOrder: id,
      createdAt: {
        $gte: day,
        $lte: moment(today).endOf('day').toDate()
      }
    };

    const paginationOptions = {
      page,
      limit,
    };

    //Retorna todas os pedidos pendentes dos ultimos 3 dias
    const pagination = await LastOrders.paginate(filters, paginationOptions);

    return res.json(paginationParser('last orders pending', pagination));

  } catch (error) {
    return res.status(400).json({ error: error.message });

  }
});

module.exports = router;
