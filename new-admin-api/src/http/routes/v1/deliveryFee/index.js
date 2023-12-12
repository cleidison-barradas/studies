const router = require('express').Router()
const AsyncLoop = require('myp-admin/utils/async-loop')
const { objectIdValidation } = require('myp-admin/http/middlewares')
const { paginationParser, updateFieldsParser } = require('myp-admin/helpers')
const {
  Mongo: {
      Models: {StoreSchema},
      getModelByTenant
  }
} = require('myp-admin/database')

const { NeighborhoodSchema } = require("myp-admin/database/mongo/models");

router.get("/:id?", objectIdValidation, async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20, query } = req.query;
    const Deliveryfee = getModelByTenant(req.tenant, "DeliveryFeeSchema");

    if (id) {
      const deliveryfee = await Deliveryfee.findById(id);

      if (!deliveryfee) {
        return res.status(404).json({
          error: "delivery_charges_not_found",
        });
      }

      return res.json({ deliveryfee });
    }

    const paginationOptions = {
      page,
      limit,
      sort: { feePrice: 1 },
    };
    const pagination = await Deliveryfee.paginate(
      query
        ? {
          $or: [
            { "neighborhood.city.name": { $regex: query, $options: "i" } },
            { "neighborhood.name": { $regex: query, $options: "i" } },
          ],
        }
        : {},
      paginationOptions
    );

    return res.json(paginationParser("deliveryFees", pagination));
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "internal_server_error",
    });
  }
});

router.post("/", objectIdValidation, async (req, res) => {
  try {
    const Stores = StoreSchema.Model()
    const Deliveryfee = getModelByTenant(req.tenant, 'DeliveryFeeSchema')
    const Neighborhood = NeighborhoodSchema.Model()
    const { deliveryTime = 60, feePrice = 0, freeFrom = 0, minimumPurchase = 0, neighborhoods = [], deliveries = [] } = req.body

    if (deliveries.length > 0) {
      await AsyncLoop(deliveries, async (delivery) => {
        const { _id, feePrice, deliveryTime, freeFrom, minimumPurchase } =
          delivery;

        if (_id) {
          const deliveryfeeExists = await Deliveryfee.findById(_id);

          if (deliveryfeeExists) {
            const updateFields = updateFieldsParser({
              feePrice,
              freeFrom,
              deliveryTime,
              minimumPurchase,
            });

            await deliveryfeeExists.updateOne({
              ...updateFields,
              updatedAt: Date.now(),
            });
          }
        }
      });
    }

    if (neighborhoods.length > 0) {
      for await (const neighborhoodId of neighborhoods) {
        const neighborhood = await Neighborhood.findById(neighborhoodId._id);

        if (neighborhood) {
          await Deliveryfee.create({
            feePrice,
            freeFrom,
            deliveryTime: Number(deliveryTime),
            neighborhood,
            minimumPurchase,
          });
        }
      }
    }

    let store = await Stores.findById(req.store)
    if (!store) {
      return res.status(404).json({
          error: 'store_not_found',
        })
      }

    await store.updateOne({
        'settings.config_local_delivery_rule': 'neighborhood',
        updatedAt: Date.now(),
    })

    return res.json({ ok: true })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "internal_server_error",
    });
  }
});

module.exports = router;
