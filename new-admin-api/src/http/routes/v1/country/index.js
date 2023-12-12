const router = require('express').Router();

const { objectIdValidation } = require('../../../middlewares');
const { paginationParser, updateFieldsParser } = require('../../../../helpers');
const { CountrySchema } = require('myp-admin/database/mongo/models');

router.get('/:id?', objectIdValidation, async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const Country = CountrySchema.Model()

    if (id) {
      const country = await Country.findById(id);

      if (!country) {
        return res.status(404).json({ error: 'country does not found' });
      }
      return res.json({ country });
    }

    const paginationOptions = {
      page,
      limit,
    };
    const pagination = await Country.paginate({}, paginationOptions);

    return res.json(paginationParser('countries', pagination));
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.put('/', async (req, res) => {
  try {
    const { name } = req.body;
    const Country = CountrySchema.Model()

    const country = await Country.create({ name });

    return res.json({ country });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.post('/:id', objectIdValidation, async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const Country = CountrySchema.Model()

    const countryExists = await Country.findById(id);
    if (!countryExists) {
      return res.status(404).json({
        error: 'country does not found',
      });
    }

    const updateFields = updateFieldsParser({ name });

    await countryExists.updateOne({
      ...updateFields,
      updatedAt: Date.now(),
    });

    const country = await Country.findById(id);

    return res.json({ country });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', objectIdValidation, async (req, res) => {
  try {
    const { id } = req.params;
    const Country = CountrySchema.Model()

    const country = await Country.findById(id);
    if (!country) {
      return res.status(404).json({ error: 'country not found' });
    }

    await country.delete();

    return res.json({
      deletedId: id,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

module.exports = router;
