const router = require('express').Router();

const { objectIdValidation } = require('../../../middlewares');
const { paginationParser, updateFieldsParser } = require('../../../../helpers');

const { getModelByTenant } = require('myp-admin/database/mongo');

router.use((req, res, next) => {
  req.models = {
    publicAddress: getModelByTenant(req.tenant, 'PublicAddressSchema'),
    city: getModelByTenant(req.tenant, 'CitySchema'),
    neighborhood: getModelByTenant(req.tenant, 'NeighborhoodSchema'),
    state: getModelByTenant(req.tenant, 'StateSchema'),
    country: getModelByTenant(req.tenant, 'CountrySchema'),
  }
  next()
});

router.get('/:id?', objectIdValidation, async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const PublicAddress = getModelByTenant(req.tenant, 'PublicAddressSchema')

    if (id) {
      const publicAddress = await PublicAddress.findById(id)

      if (!publicAddress) {
        return res.status(404).json({ error: 'public address does not found' });
      }
      return res.json({ adresses : publicAddress });
    }

    const paginationOptions = {
      page,
      limit,
    }

    const pagination = await PublicAddress.paginate({}, paginationOptions);

    return res.json(paginationParser('address', pagination));
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.put('/', async (req, res) => {
  try {
    let { street, number, complement, neighborhood } = req.body

    const PublicAddress = getModelByTenant(req.tenant, 'PublicAddressSchema')
    const Neighborhood = getModelByTenant(req.tenant, 'NeighborhoodSchema')

    neighborhood = await Neighborhood.findById(neighborhood)

    const publicAddress = await PublicAddress.create({
      street,
      number,
      complement,
      neighborhood,
      customer: req.user._id
    });

    return res.json({ publicAddress });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.post('/:id', objectIdValidation, async (req, res) => {
  try {
    const { id } = req.params;
    const { street, number, complement, neighborhood } = req.body;
    const PublicAddress = getModelByTenant(req.tenant, 'PublicAddressSchema')
    const Neighborhood = getModelByTenant(req.tenant, 'NeighborhoodSchema')

    if(neighborhood){
      neighborhood = await Neighborhood.findById(neighborhood)
    }

    const publicAddressExists = await PublicAddress.findById(id);
    if (!publicAddressExists) {
      return res.status(404).json({
        error: 'public Address does not found',
      });
    }

    const updateFields = updateFieldsParser({
      street,
      number,
      complement,
      neighborhood,
      customer
    });

    await publicAddressExists.updateOne({
      ...updateFields,
      updatedAt: Date.now(),
    });

    const publicaddress = await PublicAddress.findById(id);

    return res.json({ publicaddress });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', objectIdValidation, async (req, res) => {
  try {
    const { id } = req.params;
    const PublicAddress = getModelByTenant(req.tenant, 'PublicAddressSchema')
    const Customer = getModelByTenant(req.tenant, 'CustomerSchema')

    const publicAddress = await PublicAddress.findById(id);

    if (!publicAddress) {
      return res.status(404).json({ error: 'public Address not found' });
    }

    await publicAddress.delete();

    await Customer.updateMany(
      {addresses : {$elemMatch : {_id : publicAddress._id}}},
      {$set:{'addresses.$[element]' : publicAddress}},
      {arrayFilters : [ {'element._id' : publicAddress._id} ],multi : true},
      )

    return res.json({
      deletedId: id,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

module.exports = router;
