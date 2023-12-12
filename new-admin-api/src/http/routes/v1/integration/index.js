const router = require('express').Router()
const { getModelByTenant } = require('myp-admin/database/mongo')
const { getIntegrationInfo } = require('myp-admin/helpers/getIntegrationInfo')
const { isERPIntegrated } = require('myp-admin/helpers/isERPIntegrated')
const { objectIdValidation } = require('myp-admin/http/middlewares')
const {
  Models: { IntegrationOptionsSchema },
} = require('myp-admin/database/mongo')

router.get('/', objectIdValidation, async (req, res) => {
  const integration = await getIntegrationInfo(req.store)

  if (!integration) {
    return res.json({
      integration: {
        erp: { name: 'ERP não definido' },
        erpVersion: { name: 'ERP não definido' },
        lastSeen: null,
        mergeableFields: [],
        status: 'unknown'
      }
    })
  }

  return res.json({
    integration
  })
})

router.get('/external/:integration', objectIdValidation, async (req, res) => {
  try {
    const { integration } = req.params //ENUM "PLUGGTO"
    const tenant = req.tenant
    const IntegrationMethods = getModelByTenant(tenant, "IntegrationMethodsSchema")
    const integrationMethod = await IntegrationMethods.findOne(
      {
        "integrationOption.type": integration
      }
    )
    if (integrationMethod) {
      const integrationData = integrationMethod.integrationData
      return res.status(200).send({active: !!integrationMethod?.active, externalIntegrationData: integrationData,})
    }
    
    throw new Error()
  }
  catch (err) {
    console.error(err)
    return res.status(500).json({error: "internal_server_error"})
  }
})

router.put('/external/:integration', objectIdValidation, async (req, res) => {
  try {
    const IntegrationOptions = IntegrationOptionsSchema.Model()

    const { integration } = req.params //ENUM "PLUGGTO"
    const {externalIntegrationData} = req.body
    console.log(externalIntegrationData)
    const tenant = req.tenant

    const integrationOption = await IntegrationOptions.findOne({type: integration})
    if(!integrationOption){
      return res.status(404).json({"status": "not found"})
    }
    const IntegrationMethods = getModelByTenant(tenant, "IntegrationMethodsSchema")
    const haveIntegration = await IntegrationMethods.findOne({
      "integrationOption.type": integration
    })

    if(haveIntegration){
      await IntegrationMethods.updateOne(
        {
          "integrationOption.type": integration
        }, 
        {
          "integrationData": externalIntegrationData
        }
      )
    } else {
      const integrationData = {
        integrationOption,
        integrationData: externalIntegrationData,
        active: true
      }
      await IntegrationMethods.create(integrationData)
    }

    return res.status(200).json({ status: "ok"})
  }
  catch (err) {
    console.error(err)
    return res.status(500).json({error: "internal_server_error"})
  }
})



router.get('/api', objectIdValidation, async (req, res) => {
  const erpArray = ['Trier']
  try {
    const apiIntegration = await isERPIntegrated(erpArray, req.tenant)

    if (!apiIntegration) {
      return null
    }

    return res.json({
      apiIntegration
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: "erro ao buscar integração" })
  }

})
module.exports = router
