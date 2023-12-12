const router = require('express').Router();
const AsyncLoop = require('myp-admin/utils/async-loop');

const { getModelByTenant, Models: { StateSchema, CitySchema, NeighborhoodSchema} } = require('myp-admin/database/mongo');
const { ObjectId } = require('mongodb');

router.use((req, res, next) => {
  req.models = {
    deliveryFee: getModelByTenant(req.tenant, 'DeliveryFeeSchema')
  }
  next()
})

router.post('/delete', async (req, res) => {
  try {
    const Deliveryfee = req.models.deliveryFee
    const { deliveries } = req.body;
    let deletedId = []

    if (deliveries.length > 0) {
      await AsyncLoop(deliveries, async id => {

        const delivery = await Deliveryfee.findById(id);

        if (delivery) {
          deletedId.push(delivery)
          await delivery.delete()
        }
      })

      return res.json({
        deletedId
      })
    }

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: 'internal_server_error'
    })
  }
});

router.get('/states/:id?', async (req, res) => {
  try {
    const State = StateSchema.Model()
    const { id } = req.params;

    if (id) {
      const state = await State.findById(id)

      if (!state) {
        return res.status(404).json({
          error: 'state_not_found'
        })
      }

      return res.json({
        state
      })

    }

    const states = await State.find({})

    if (!states) {
      return res.status(404).json({
        error: 'states_not_found'
      })
    }

    return res.json({
      states
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: 'internal_server_error'
    });
  }
});

router.get('/cities/:id?', async (req, res) => {
  try {
    const City = CitySchema.Model()
    const { id } = req.params;

    let cities = await City.find({
      'state._id': new ObjectId(id)
    })

    cities = cities.filter(c => c.state !== null && typeof c.state === 'object')

    if (!cities) {
      return res.status(404).json({
        cities: []
      })
    }

    return res.json({
      cities
    });

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: 'internal_server_error'
    });
  }
});

router.get('/neighborhoods/:id?', async (req, res) => {
  try {
    const Neighborhood = NeighborhoodSchema.Model()
    const { id } = req.params;

    let neighborhoods = await Neighborhood.find({
      'city._id': new ObjectId(id)
    })
    neighborhoods = neighborhoods.filter(neighborhood => neighborhood.city !== null && typeof neighborhood.city === 'object')

    if (!neighborhoods) {
      return res.status(404).json({
        neighborhoods: []
      })
    }

    return res.json({
      neighborhoods
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: 'internal_server_error'
    });
  }

});

router.put('/neighborhoods', async (req, res) => {
  try {
    const Neighborhood = NeighborhoodSchema.Model()
    const City = CitySchema.Model()
    let { value, city } = req.body;

    const neighborhoodNameExists = await Neighborhood.exists({ name: value, "city._id": new ObjectId(city._id) });

    if (neighborhoodNameExists) {
      return res.status(404).json({
        error: 'neighborhood_name_already_use'
      })
    }

    city = await City.findById(city._id)

    if (!city) {
      return res.status(401).json({
        error: 'city_not_found'
      })
    }

    const neighborhood = await Neighborhood.create({
      name: value.toUpperCase(),
      city
    })

    return res.json({
      neighborhood
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: 'internal_server_error'
    });
  }
})


module.exports = router;
