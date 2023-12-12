const router = require('express').Router()

// Redis
const { redis } = require('../../../../services')

// Helpers
const { normalizeCategory } = require('../../../../helpers')

router.get('/:storeId/:categoryId/:pmcId?', async (req, res) => {
  const { storeId, categoryId, pmcId } = req.params
  let { start = 0, end = 50 } = req.query

  // Parse query
  start = Number(start)
  end = Number(end)

  if (isNaN(start)) {
    return res.status(403).json({
      error: 'invalid_paginate_start_value'
    })
  }
  if (isNaN(end)) {
    return res.status(403).json({
      error: 'invalid_paginate_end_value'
    })
  }

  const productIds = await redis.getCategory({ categoryId, storeId, start, end })
  const products = await normalizeCategory(storeId, productIds, pmcId)
  const total = await redis.countCategory({ categoryId, storeId })
  const size = end - start
  const nextEnd = end + size

  // Next pagination
  const next = {
    start: end + 1,
    end: nextEnd > total ? total : nextEnd
  }

  res.json({
    total,
    size,
    next: start + size < total ? next : null,
    products
  })
})

module.exports = router
