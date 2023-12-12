const router = require('express').Router()
const { normalizeNeighborhood } = require('../../../../helpers')
const { elasticSearch } = require('../../../../services')

router.post('/', async (req, res) => {
    try {
      const { address } = req.body
    if (!address || address.length === 0) {
      return res.json({
        message: 'There no address'
      })
    }
  
    if (!(await elasticSearch.exists({ prefix: 'mongo', storeId: 'neighborhood' }))) {
      return res.status(404).json({
        error: 'address_unavailable'
      })
    }
  
    const { body: { hits } } = await elasticSearch.searchAddress(address)

    const neighborhood = await normalizeNeighborhood(hits)
  
    return res.json({
      neighborhood
    })
    } catch (error) {
      console.log(error)
      return res.status(500).json({error: error.message})
    }
})
  

module.exports = router