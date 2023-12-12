const router = require('express').Router()
const { mongoCategory } = require('../../../../helpers')

router.get('/:tenant/:storeId/:categoryId', async (req, res) => {
  try {
    const { tenant, categoryId, storeId } = req.params
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
    const { products, total } = await mongoCategory(categoryId, tenant, storeId, start, end)

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
  } catch (error) {
    console.log(error)
  }
})

module.exports = router