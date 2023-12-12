const router = require('express').Router()
const { Models: { RouteLinkSchema } } = require('myp-admin/database/mongo')

router.get('/', async (req, res) => {
  try {
    const RouteLinks = RouteLinkSchema.Model()

    const links = await RouteLinks.find({})

    return res.json({
      links
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
    const RouteLinks = RouteLinkSchema.Model()
    const { title, name, path, image, roles, external, children } = req.body

    const link = await RouteLinks.create({
      title,
      name,
      path,
      image,
      roles,
      external,
      children
    })

    return res.json({
      link
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: 'internal_server_error'
    })
  }
})

router.post('/:linkId', async (req, res) => {
  try {
    const { linkId } = req.params
    const RouteLinks = RouteLinkSchema.Model()
    const { title, name, path, image, roles, external, children } = req.body

    let link = await RouteLinks.findById(linkId)

    if (!link) {
      return res.status(404).json({
        error: 'link_not_found'
      })
    }
    await link.updateOne({
      title,
      name,
      path,
      image,
      roles,
      external,
      children
    })

    link = await RouteLinks.findById(linkId)

    return res.json({
      link
    })

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: 'internal_server_error'
    })
  }
})

module.exports = router