const router = require('express').Router();
const { Mongo:
  {
    Models: {
      StoreSchema
    },
    getModelByTenant
  }
} = require('myp-admin/database');
const parser = require('tld-extract')

router.get('/', async (req, res) => {
  const StoreGroupSchema = getModelByTenant(req.tenant, 'StoreGroupSchema')
  try {
    const groups = await StoreGroupSchema.find({}).limit(1)

    return res.json({
      groups
    })

  } catch (error) {
    return res.status(500).json({
      error: 'internal_server_error'
    });
  }
})

router.get('/stores', async (req, res) => {
  try {
    const Store = StoreSchema.Model()
    const store = await Store.findById(req.store)

    if (!store) {
      return res.status(404).json({
        error: 'store_not_found'
      })
    }
    const { domain } = parser(store.url)

    if (domain === '') {
      return res.json({
        stores: []
      })
    }

    const stores = await Store.find({
      url: { $regex: domain },
      _id: { $ne: req.store }
    }).select(['tenant', 'name', 'url', '_id'])

    return res.json({
      stores
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: 'internal_server_error'
    })
  }
})

router.get('/urls', async (req, res) => {
  try {
    const Store = StoreSchema.Model()
    const store = await Store.findById(req.store)

    return res.json({
      storeUrls: store.storeUrls
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: 'internal_server_error'
    })
  }
})

router.put('/', async (req, res) => {
  const StoreGroup = getModelByTenant(req.tenant, 'StoreGroupSchema')
  const Store = StoreSchema.Model()

  try {
    const { _id = null, name, stores = [] } = req.body
    let storesToAdd = []

    if (stores.length <= 0) {
      return res.status(403).json({
        error: 'store_not_have_subdomains_registred'
      })
    }

    const storeIds = stores.map(s => s._id)
    storesToAdd = await Store.find({ _id: { $in: storeIds } })

    if (_id) {
      const updateGroup = await StoreGroup.findById(_id)

      if (updateGroup) {
        await updateGroup.updateOne({
          name,
          stores: storesToAdd
        })

        const group = await StoreGroup.findById(_id)

        return res.json({
          group
        })
      }
    }

    const group = await StoreGroup.create({
      name,
      stores: storesToAdd
    })

    return res.json({
      group
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: 'internal_server_error'
    })
  }
})

router.post('/urls', async (req, res) => {
  try {
    const Store = StoreSchema.Model()
    const store = await Store.findById(req.store)
    const { storeUrls = [] } = req.body

    if (store) {
      const { domain } = parser(store.url)

      const stores = await Store.find({
        url: { $regex: domain }
      }).select(['tenant', 'name', 'url', '_id'])

      if (stores.length <= 0) {
        return res.status(403).json({
          error: 'store_not_have_subdomains_registred'
        })
      }

      if (storeUrls.length === 0) {
        await store.updateOne({
          storeUrls
        })

        const storeUpdate = await Store.findById(req.store)

        return res.json({
          ok: true,
          storeUrls: storeUpdate.storeUrls,
        })
      }

      storeUrls.forEach((item, index) => {
        const exists = stores.find(store => store.url === item.url_address)
        if (!exists) {
          storeUrls.splice(index, 1)
        }
      })

      if (storeUrls.length > 0) {
        await store.updateOne({
          storeUrls
        })
        const storeUpdate = await Store.findById(req.store)

        return res.json({
          ok: true,
          storeUrls: storeUpdate.storeUrls,
        })
      }

      return res.status(400).json({
        error: 'url_not_exits_in_store'
      })

    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: 'internal_server_error'
    })
  }
})

router.delete('/:groupId', async (req, res) => {
  try {
    const StoreGroup = getModelByTenant(req.tenant, 'StoreGroupSchema')
    const { groupId } = req.params

    const group = await StoreGroup.findById(groupId)

    if (group) {
      await group.deleteOne()

      return res.json({
        deletedId: groupId
      })
    }

    return res.status(404).json({
      error: 'group_not_found'
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: 'internal_server_error'
    })
  }
})

module.exports = router;
