// Router
const router = require('express').Router();
const { ObjectId } = require('bson');
// Helpers
const { paginationParser } = require('myp-admin/helpers')
const updateFieldsParser = require('myp-admin/helpers/update-fields.parser')
// Models
const {
  Mongo: {
    Models: {
      PlanSchema,
      StoreSchema
    }
  }
} = require('myp-admin/database');
// Middlewares
const { objectIdValidation } = require('myp-admin/http/middlewares')

/**
 * List or detail entity
 */
router.get('/:id?', objectIdValidation, async (req, res) => {
  const { id } = req.params;
  const Plan = PlanSchema.Model()
  const { page = 1, limit = 20 } = req.query;

  // Detail plan
  if (id) {
    const plan = await Plan.findById(id);

    if (!plan) {
      return res.status(404).json({
        error: 'plan_not_found',
      });
    }

    return res.json({
      plan,
    });
  }

  // Pagination options
  const paginationOptions = {
    page,
    limit,
  };

  // Make pagination
  const pagination = await Plan.paginate({}, paginationOptions);

  return res.json(paginationParser('plan', pagination));
});

/**
 * Store a new entity
 */
router.put('/', async (req, res) => {
  try {
    const { name, description, price, rule, permissions } = req.body;
    const Plan = PlanSchema.Model()

    const plan = await Plan.create({
      name,
      description,
      price,
      rule,
      permissions
    })

    return res.json({
      plan,
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: 'internal_server_error'
    })
  }
})

/**
 * Update an existing entity
 */
router.post('/:id', objectIdValidation, async (req, res) => {
  try {
    const Plan = PlanSchema.Model()
    const Store = StoreSchema.Model()

    const { id } = req.params;

    const { name, description, price, rule, permissions } = req.body;

    let plan = await Plan.findById(id);

    if (!plan) {
      return res.status(404).json({
        error: 'plan_not_found',
      });
    }

    // Mount update fields object
    const updateFields = updateFieldsParser({
      name,
      description,
      price,
      rule,
      permissions
    });

    // Update data
    await plan.updateOne({
      ...updateFields,
      updatedAt: Date.now(),
    })

    // Get updated data
    plan = await Plan.findById(id)

    await Store.updateMany({ 'plan._id': ObjectId(id) }, { $set: { plan } })

    return res.json({
      plan,
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: 'internal_server_error'
    })
  }

})

/**
 * Delete an existing entity
 */
router.delete('/:id', objectIdValidation, async (req, res) => {
  const { id } = req.params;
  const Plan = PlanSchema.Model()

  const plan = await Plan.findById(id);

  if (!plan) {
    return res.status(404).json({
      error: 'plan_not_found',
    });
  }

  // Make deletion
  await plan.delete();

  return res.json({
    deletedId: id,
  });
});

module.exports = router;
