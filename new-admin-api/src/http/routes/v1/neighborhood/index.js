const router = require('express').Router();

const { objectIdValidation } = require('../../../middlewares');
const { paginationParser, updateFieldsParser } = require('../../../../helpers');

const { Mongo: { getModelByTenant } } = require('myp-admin/database')

router.get('/:id?', objectIdValidation, async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const Neighborhood = getModelByTenant(req.tenant, 'NeighborhoodSchema')

    if (id) {
      const neighborhood = await Neighborhood.findById(id)

      if (!neighborhood) {
        return res.status(404).json({ error: 'neighborhood does not found' });
      }
      return res.json({ neighborhood });
    }

    const paginationOptions = {
      page,
      limit,
    };
    const pagination = await Neighborhood.paginate({}, paginationOptions);

    return res.json(paginationParser('Neighborhoods', pagination));
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.put('/', async (req, res) => {
  try {
    let { name, city } = req.body;
    const Neighborhood = getModelByTenant(req.tenant, 'NeighborhoodSchema')
    const City = getModelByTenant(req.tenant, 'CitySchema')

    const neighborhoodExists = await Neighborhood.exists({ name });

    if (neighborhoodExists) {
      return res.status(400).json({ error: 'neighborhood already exists' })
    }

    city = await City.findById(city)

    const neighborhood = await Neighborhood.create({ name, city });

    return res.json({ neighborhood });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.post('/:id', objectIdValidation, async (req, res) => {
  try {
    const { id } = req.params;
    let { name, city } = req.body;
    const Neighborhood = getModelByTenant(req.tenant, 'NeighborhoodSchema')
    const City = getModelByTenant(req.tenant, 'CitySchema')


    const neighborhoodExists = await Neighborhood.findById(id);
    if (!neighborhoodExists) {
      return res.status(404).json({
        error: 'neighborhood does not found',
      });
    }

    if(city){
      city = await City.findById(city)
    }

    const updateFields = updateFieldsParser({ name, city });

    await neighborhoodExists.updateOne({
      ...updateFields,
      updatedAt: Date.now(),
    });

    const neighborhood = await Neighborhood.findById(id);

    return res.json({ neighborhood });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', objectIdValidation, async (req, res) => {
  try {
    const { id } = req.params;
    const Neighborhood = getModelByTenant(req.tenant, 'NeighborhoodSchema')

    const neighborhood = await Neighborhood.findById(id);
    if (!neighborhood) {
      return res.status(404).json({ error: 'neighborhood not found' });
    }

    await neighborhood.delete();

    return res.json({
      deletedId: id,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

module.exports = router;
