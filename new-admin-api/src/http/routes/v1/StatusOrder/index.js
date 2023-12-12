const router = require('express').Router();

const { updateFieldsParser } = require('myp-admin/helpers')
const { objectIdValidation } = require('myp-admin/http/middlewares')

const { Models: { StatusOrderSchema } } = require('myp-admin/database/mongo');

router.get('/:id?', objectIdValidation, async (req, res) => {
  try {
    const { id } = req.params;
    const StatusOrder = StatusOrderSchema.Model()
    let status = null

    if (id) {
      status = await StatusOrder.findById(id);

      if (!status) {
        return res.status(404).json({
          error: 'status_not_found',
        });
      }

      return res.json({ status });
    }

    status = await StatusOrder.find({ type: { $nin: ['integrated_in_erp', 'erp_integration_error'] } })

    return res.json({
      status
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: 'internal_server_error'
    })
  }

})

router.put('/', async (req, res) => {
  try {

    const StatusOrder = StatusOrderSchema.Model()
    const { name, type } = req.body;

    const sameStatusExist = await StatusOrder.exists({ name })

    if (sameStatusExist) {
      return res.status(400).json({
        error: 'status_already_use'
      })
    }

    const status = await StatusOrder.create({
      name,
      type
    })

    return res.json({
      status
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: 'internal_server_error'
    })
  }

})

router.post('/:id', objectIdValidation, async (req, res) => {
  try {

    const { id } = req.params;
    const { name, type } = req.body;
    const StatusOrder = StatusOrderSchema.Model()

    let Status = await StatusOrder.findById(id);
    if (!Status) {
      return res.status(404).json({ error: 'status does not found' });
    }

    const updateFields = updateFieldsParser({
      name,
      type
    })

    await status.updateOne({
      ...updateFields,
      updatedAt: Date.now(),
    })

    status = await StatusOrder.findById(id)

    return res.json({
      status
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: 'internal_server_error'
    })
  }

})

router.delete('/:id', objectIdValidation, async (req, res) => {
  try {
    const { id } = req.params;
    const StatusOrder = StatusOrderSchema.Model()

    const status = await StatusOrder.findById(id);
    if (!status) {
      return res.status(404).json({
        error: 'status_not_found'
      })
    }

    await status.delete()

    return res.json({
      deletedId: id
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: 'internal_server_error'
    })
  }

})

module.exports = router;
