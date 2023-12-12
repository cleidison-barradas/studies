const router = require('express').Router();

const { objectIdValidation } = require('../../../middlewares');
const { paginationParser, updateFieldsParser } = require('../../../../helpers');

const { StateSchema, CountrySchema } = require('myp-admin/database/mongo/models');


router.get('/:id?', objectIdValidation, async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const State = StateSchema.Model()

    if (id) {
      const state = await State.findById(id);

      if (!state) {
        return res.status(404).json({ error: 'state does not found' });
      }
      return res.json({ state });
    }

    const paginationOptions = {
      page,
      limit,
      populate: ['country']
    };
    const pagination = await State.paginate({}, paginationOptions);

    return res.json(paginationParser('States', pagination));
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.put('/', async (req, res) => {
  try {
    let { name, country } = req.body;
    const State = StateSchema.Model()
    const Country = CountrySchema.Model()

    country = await Country.findById(country)

    const state = await State.create({ name, country });

    return res.json({ state });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.post('/:id', objectIdValidation, async (req, res) => {
  try {
    const { id } = req.params;
    let { name, country } = req.body;

    const State = StateSchema.Model()
    const Country = CountrySchema.Model()

    const stateExists = await State.findById(id);
    if (!stateExists) {
      return res.status(404).json({
        error: 'state does not found',
      });
    }

    if(country){
      country = await Country.findById(country)
    }

    const updateFields = updateFieldsParser({ name, country });

    await stateExists.updateOne({
      ...updateFields,
      updatedAt: Date.now(),
    });

    const state = await State.findById(id);

    return res.json({ state });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', objectIdValidation, async (req, res) => {
  try {
    const { id } = req.params;
    const State = StateSchema.Model()

    const state = await State.findById(id);
    if (!state) {
      return res.status(404).json({ error: 'state not found' });
    }

    await state.delete();

    return res.json({
      deletedId: id,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

module.exports = router;
