const { Mongo: { Models: { StoreSchema } } } = require('myp-admin/database')

module.exports = async (req, res, next) => {
  const Store = StoreSchema.Model()
  const url = req.get("x-origin") || req.get("origin")

  if (!url) {
    return res.status(400).json({
      error: 'store_url_not_provided'
    })
  }

  const store = await Store.findOne({ url: { $regex: url, $options: 'i' } })

  if (!store) {
    return res.status(404).json({
      error: 'store_not_found'
    })
  }

  req.store = store._doc

  next()
}
