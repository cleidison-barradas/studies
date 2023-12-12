const router = require('express').Router();

const { Mongo: { getModelByTenant } } = require('myp-admin/database')
const { objectIdValidation } = require('../../../middlewares');
const { paginationParser } = require('../../../../helpers');

router.get('/:id?', objectIdValidation, async (req, res) => {
  try {
    const History = getModelByTenant(req.tenant, 'HistoryAboutUsSchema')
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;

    if (id) {
      const history = await History.findById(id)

      if (!history) {
        return res.status(404).json({ history });
      }
      return res.json({ history });
    }
    const paginationOptions = {
      page,
      limit,
    };

    const pagination = await History.paginate({}, paginationOptions);

    return res.json(paginationParser('history aboutUs', pagination));
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});



module.exports = router;



