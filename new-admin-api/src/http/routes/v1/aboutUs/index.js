const router = require('express').Router()
const { paginationParser } = require('myp-admin/helpers')
const { getModelByTenant } = require('myp-admin/database/mongo')
const { objectIdValidation } = require('myp-admin/http/middlewares')
const updateFieldsParser = require('myp-admin/helpers/update-fields.parser')

router.get('/:id?', objectIdValidation, async (req, res) => {
  const { id } = req.params
  const { page = 1, limit = 20 } = req.query
  const AboutUs = getModelByTenant(req.tenant, 'AboutUsSchema')

  if (id) {
    const aboutUs = await AboutUs.findById(id)

    if (!aboutUs) {
      return res.status(404).json({ error: 'about us does not found' });
    }
    return res.json({ aboutUs })

  } else {
    const paginationOptions = {
      page,
      limit,
      sort: "-createdAt",
    }

    const pagination = await AboutUs.paginate({}, paginationOptions)

    return res.json(
      paginationParser('aboutUs', pagination)
    )

  }
})

router.put('/', async (req, res) => {
  const AboutUs = getModelByTenant(req.tenant, 'AboutUsSchema')
  const User = getModelByTenant(req.tenant, 'UserSchema')

  let { user, content, id, published } = req.body;

  try {
    if (id) {
      const exists = await AboutUs.findById(id);
      user = await User.findById(user)
      if (exists) {
        await exists.updateOne({
          user,
          content,
          published
        })
      }

      const aboutUs = await AboutUs.findById(id);

      return res.json({
        aboutUs
      });
    }

    user = await User.findById(user)
    const aboutUs = await AboutUs.create({
      user,
      content,
      published
    })

    return res.json({ aboutUs });

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: 'internal_server_error'
    })
  }

});

router.post('/:id', objectIdValidation, async (req, res) => {
  const AboutUs = getModelByTenant(req.tenant, 'AboutUsSchema')
  const history = getModelByTenant(req.tenant, 'HistoryAboutUsSchema');
  const User = getModelByTenant(req.tenant, 'UserSchema');

  try {
    const { id } = req.params
    let { user, content, published } = req.body

    let aboutUs = await AboutUs.findById(id)

    if (!aboutUs) {
      return res.status(404).json({
        error: 'aboutUs not found'
      })
    }

    if (user) {
      user = await User.findById(user)
    }

    const fieldContentEquals = await AboutUs.findOne({
      content,
      updatedAt: Date.now()
    });

    if (fieldContentEquals) {
      return res.status(400).json({
        message: 'already has the same entry try another text'
      });
    }

    const oldAboutUs = await AboutUs.findById(id);

    await history.create({
      oldContent: oldAboutUs.content,
      aboutUs: oldAboutUs,
      user,
    })

    const updatedFields = updateFieldsParser({
      user,
      content,
      published
    })

    await aboutUs.updateOne({
      ...updatedFields,
      updatedAt: Date.now()
    });

    aboutUs = await AboutUs.findById(id)

    return res.json({
      aboutUs
    });

  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: 'internal_server_error'
    })

  }
});

router.delete('/:id', objectIdValidation, async (req, res) => {
  const { id } = req.params
  const AboutUs = getModelByTenant(req.tenant, 'AboutUsSchema')

  const aboutUs = await AboutUs.findById(id)

  if (!aboutUs) {
    return res.status(404).json({
      error: 'aboutUs not found'
    })
  }

  await aboutUs.delete();

  return res.json({
    deletedId: id
  })

})

module.exports = router
