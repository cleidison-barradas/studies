const router = require('express').Router();

const { objectIdValidation } = require('../../../middlewares');
const { paginationParser, updateFieldsParser } = require('../../../../helpers');

const { Mongo: { getModelByTenant } } = require('myp-admin/database');
const { CitySchema, StateSchema } = require('myp-admin/database/mongo/models');

router.get('/:id?', objectIdValidation, async (req, res) => {
  try {
    const City = CitySchema.Model()

    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;

    if (id) {
      const city = await City.findById(id)

      if (!city) {
        return res.status(404).json({ error: 'city_not_found' });
      }
      return res.json({ city });
    }

    const paginationOptions = {
      page,
      limit,
    };

    const pagination = await City.paginate({}, paginationOptions);

    return res.json(paginationParser('Cities', pagination));
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.put('/', async (req, res) => { 
  try {
    const City = CitySchema.Model()
    const State =  StateSchema.Model()

    let { name, state } = req.body;

    state = await State.findById(state)

    const city = await City.create({ name, state });

    return res.json({ city });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.post('/:id', objectIdValidation, async (req, res) => {
  try {
    const City = CitySchema.Model()
    const State =  StateSchema.Model()

    const { id } = req.params;
    let { name, state } = req.body;

    const cityExists = await City.findById(id);

    if (!cityExists) {
      return res.status(404).json({
        error: 'city does not found',
      });
    }

    if(state){
      state = await State.findById(state)
    }

    const updateFields = updateFieldsParser({ name, state });

    await cityExists.updateOne({
      ...updateFields,
      updatedAt: Date.now(),
    });

    const city = await City.findById(id);

    return res.json({ city });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', objectIdValidation, async (req, res) => {
  try {
    const { id } = req.params;
    const City = CitySchema.Model()
    const Neighborhood = getModelByTenant(req.tenant, 'NeighborhoodSchema')

    const city = await City.findById(id);

    if (!city) {
      return res.status(404).json({ error: 'city not found' });
    }

    await city.delete();
    await Neighborhood.updateMany({
      'city._id' : city._id
    },{
      city : null
    })

    return res.json({
      deletedId: id,
    });

  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

module.exports = router;
