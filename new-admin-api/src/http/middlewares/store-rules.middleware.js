const  { Models: { StoreSchema } } = require('../../database/mongo')

function allowOnly(role = []) {
    const isPermited = async (req, res, next) => {
      const Store = StoreSchema.Model()

      const store = await Store.findById(req.store)

      if (!store) {
        return res.status(404).json({
          error: 'store_not_found_on_check_rule'
        })
      }

      if (!store.plan) {
        return res.status(400).json({
          error: 'store_plan_not_defined'
        })
      }

      const { rules } = store.plan
      
      if (role.includes(rules)) return next ()

      return res.status(403).json({
        error: 'access_denied_store'
      })
    }
    return isPermited
}

module.exports = { allowOnly }