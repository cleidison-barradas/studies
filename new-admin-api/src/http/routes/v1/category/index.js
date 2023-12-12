const router = require('express').Router()
const {
  Mongo: { getModelByTenant },
} = require('myp-admin/database')

const { updateFieldsParser, paginationParser } = require('myp-admin/helpers')
const { objectIdValidation } = require('myp-admin/http/middlewares')
const RedisService = require("myp-admin/services/redis");

const { put } = require('myp-admin/services/aws')
const ImageCompress = require('myp-admin/utils/fileHelper')

router.get('/:id?', objectIdValidation, async (req, res) => {
  const Category = getModelByTenant(req.tenant, 'CategorySchema')
  const { id } = req.params
  const { name = '', type = '', page = 1, limit = 20 } = req.query

  if (id) {
    const category = await Category.findById(id)

    if (!category) {
      return res.status(404).json({
        error: 'category_not_found',
      })
    }

    return res.json({
      category,
    })
  }

  const paginationOptions = {
    page,
    limit,
  }

  const filters = {}

  if (name.length > 0) {
    filters.name = new RegExp(name, 'gi')
  }
  if (type === 'mainCategory') {
    filters.parentId = '0'
  }
  else if (type === `subCategory`) {
    filters.parentId = { $ne: '0' }
  }

  const pagination = await Category.paginate(filters, paginationOptions)

  return res.json(paginationParser('categorys', pagination))
})

router.put('/', async (req, res) => {
  try {
    let { parentId, name, metaTitle, metaDescription, status, sort, subCategories = [], image, position } = req.body
    const Category = getModelByTenant(req.tenant, 'CategorySchema')
    subCategories && subCategories.length > 0
      ? (subCategories = subCategories.map((category) => category._id))
      : (subCategories = [])

    subCategories = await Category.find({ _id: { $in: subCategories } })

    if (image) {
      image = {
        content: await ImageCompress(image, { width: 120, height: 120 }),
      }
      const path = `${req.tenant}/categorys/${name}-${new Date().getTime()}.webp`
      const imageUpload = await put(path, image)

      image = imageUpload.Key
    }

    await Category.updateMany({ position }, { position: null })

    let category = await Category.create({
      parentId,
      name,
      metaTitle,
      sort,
      metaDescription,
      status,
      subCategories,
      image,
      position
    })

    subCategories.map((subcategory) => {
      return {
        ...subcategory,
        parentId: category._id.toString(),
      }
    })
    category = await Category.findById(category._id)

    await category.updateOne({
      subCategories,
    })

    category = await Category.findById(category._id)

    return res.json({
      category,
      success: true,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: 'internal_server_error',
    })
  }
})

router.post('/:id', async (req, res) => {
  try {
    const Category = getModelByTenant(req.tenant, 'CategorySchema')
    const Product = getModelByTenant(req.tenant, 'ProductSchema')
    const { id } = req.params
    let { originalId, parentId, name, description, metaTitle, metaDescription, status, sort, subCategories = [], image, position } = req.body

    let category = await Category.findById(id)

    if (!category) {
      return res.status(404).json({
        error: 'category_not_found',
      })
    }

    if (subCategories && subCategories.length > 0) {
      subCategories = subCategories.map((subcategory) => subcategory._id)

      await Category.updateMany(
        {
          _id: { $in: subCategories },
        },
        { $set: { parentId: category._id } }
      )

      subCategories = await Category.find({ _id: { $in: subCategories } })
    }

    const updateFields = updateFieldsParser({
      originalId,
      parentId,
      image,
      name,
      position,
      description,
      metaTitle,
      metaDescription,
      subCategories,
      status,
      sort,
    })

    if (image && image.content) {
      image = {
        content: await ImageCompress(image.content, { width: 120, height: 120 }),
      }
      const path = `${req.tenant}/categorys/${name}-${new Date().getTime()}.webp`
      const imageUpload = await put(path, image)

      updateFields['image'] = imageUpload.Key
    }

    await Category.updateMany({ position }, { position: null })

    await category.updateOne({
      ...updateFields,
      position,
      updatedAt: Date.now(),
    })

    category = await Category.findById(id)

    await Product.updateMany(
      {
        category: { $elemMatch: { _id: category._id } }
      },
      {
        $set: { 'category.$': category }
      }
    )

    await Category.updateMany(
      { subCategories: { $elemMatch: { _id: category._id } } },
      { $set: { 'subCategories.$[element]': category } },
      { arrayFilters: [{ 'element._id': category._id }], multi: true }
    )

    await RedisService.remove(`category:${req.tenant}`)

    return res.json({
      category,
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: 'internal_server_error',
    })
  }
})

module.exports = router
