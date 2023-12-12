const router = require('express').Router()

const { objectIdValidation, stoneCardFeeValidation } = require('myp-admin/http/middlewares/index.js')
// const CovenantMethodService = require('./services/Covenant.service.js')
const GatewayService = require('./services/Gateway.service.js')

// const covenantMethodService = new CovenantMethodService()
const gatewayMethodService = new GatewayService()

router.get('/gateways', async (req, res) => {
  const { tenant } = req

  try {
    const gatewayMethods = await gatewayMethodService.getAll(tenant)

    if (gatewayMethods.length <= 0) {
      return res.status(404).json({
        error: 'do_not_have_gateway_payments_registred',
      })
    }

    return res.status(200).json({
      gateways: gatewayMethods
    })
  } catch (error) {
    console.error(error)
    return res.status(404).json({
      error: 'gateways_not_found',
    })
  }
})

router.put('/gateways', stoneCardFeeValidation, async (req, res) => {
  const { tenant } = req
  const { paymentMethod } = req.body
  const { ip = ''} = req

  try {
    if(ip.length > 0){
      paymentMethod.updatedBy = { clientIP: ip }
    }

    const optionName = paymentMethod.paymentOption.name
    await gatewayMethodService.changeActiveGateway(optionName, tenant)

    const methodExists = await gatewayMethodService.methodExists(paymentMethod, tenant)

    if (methodExists && !methodExists.installmentsDetails && optionName === 'Stone') {
      await gatewayMethodService.createStoneInstallmentsDetails(methodExists, tenant)
    }

    if (methodExists) {
      const updated = await gatewayMethodService.update(paymentMethod, tenant)

      if (updated !== methodExists) {
        return res.status(200).json({ paymentMethod: updated })
      } else {
        return res.status(422).json({
          error: 'unprocessable_entity',
        })
      }
    }

    const newGateway = await gatewayMethodService.create(paymentMethod, tenant)

    if (newGateway) {
      return res.status(201).json({
        paymentMethod: newGateway
      })
    } else {
      return res.status(400).json({
        error: 'bad_request'
      })
    }
  } catch (error) {
    console.error(error)
    return res.status(400).json({
      error: 'internal_server_error'
    })
  }
})

router.delete('/gateways/:id?', objectIdValidation, async (req, res) => {
  const { params: { id }, tenant } = req

  try {
    const gatewayMethod = await gatewayMethodService.getById(id, tenant)

    if (!gatewayMethod || gatewayMethod.length <= 0) {
      return res.status(404).json({
        error: 'gateway_method_not_found'
      })
    }

    const { deletedId } = await gatewayMethod[0].remove()

    return res.status(200).json({ deletedId })
  } catch (error) {
    console.error({ error })
    return res.status(500).json({
      error: 'internal_server_error',
    })
  }
})

module.exports = router
