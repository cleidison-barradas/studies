const router = require("express").Router();
const { remove } = require("myp-admin/services/aws");
const { ObjectId } = require("bson");
const { QueuePlugin } = require('@mypharma/api-core')
const RedisService = require('myp-admin/services/redis')
const { getModelByTenant } = require('myp-admin/database/mongo')

router.post("/delete", async (req, res) => {
  try {
    const File = getModelByTenant(req.tenant, "FileSchema");
    const Product = getModelByTenant(req.tenant, "ProductSchema");
    const Showcase = getModelByTenant(req.tenant, "ShowCaseSchema");
    const { id } = req.body;

    if (id instanceof Array && id.length > 0) {
      let deletedId = [];

      for await (const productId of id) {
        const product = await Product.findById(productId);

        if (product) {
          if (
            product.image &&
            product.image.key &&
            product.image.key.includes(req.tenant)
          ) {
            const file = await File.findById(product.image._id);
            file && (await remove(file.key));
            file && (await file.delete());
          }

          await Showcase.updateMany(
            {},
            {
              $pull: {
                products: {
                  "product._id": new ObjectId(product._id)
                },
              },
            }
          );
          await product.delete();
          deletedId.push({
            productId,
          });
        }
      }
      return res.json({ deletedId });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        error: "product_not_found",
      });
    }
    if (product.image) {
      const file = await File.findById(product.image);

      if (product.image.key && product.image.key.includes(req.tenant)) {
        await remove(product.image.key);
      }
      await file.delete();
    }

    await product.delete();

    await RedisService.remove(`showcase:${req.store}`)

    return res.json({
      deletedId: id,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "internal_server_error",
    });
  }
});

router.put('/category', async (req, res) => {
  try {
    const Product = getModelByTenant(req.tenant, 'ProductSchema')
    const Category = getModelByTenant(req.tenant, 'CategorySchema')
    const { product = [], category = [] } = req.body
    const invalidateEans = []

    if (product instanceof Array && product.length > 0) {
      const productIds = product.map(product => new ObjectId(product._id))

      if (category.length > 0) {
        const categoryIds = category.map(id => new ObjectId(id))

        const categories = await Category.find({ _id: { $in: categoryIds } })

        // update each product and add categories that are not already present
        for await (let p of product){
          const productCategories = p.category || [] // handle case where category is undefined
          const newCategories = categories.filter(c => !productCategories.includes(c._id.toString()))
          await Product.updateOne(
            { _id: new ObjectId(p._id) },
            { $addToSet: { category: { $each: newCategories } } }
          )
          invalidateEans.push({
            tenant: req.tenant,
            ean: p.EAN
          })
        }
      }
      else {
        // remove all categories from the products
        await Product.updateMany(
          { _id: { $in: productIds } },
          { $unset: { category: "" } }
        )
        invalidateEans.push(...product.map(p => ({
          tenant: req.tenant,
          ean: p.EAN
        })))
      }
      await QueuePlugin.publish('mongo-invalidate-product', invalidateEans)
      await RedisService.remove(`showcase:${req.store}`)
    }

    return res.json({ ok: true })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "internal_server_error",
    });
  }
})

module.exports = router;