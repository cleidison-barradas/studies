const router = require("express").Router();
const crypto = require("crypto");
const { ObjectId } = require("bson");
const { QueuePlugin } = require("@mypharma/api-core");

const ImageCompress = require("myp-admin/utils/fileHelper");
const { put, remove } = require("myp-admin/services/aws");

const RedisService = require("myp-admin/services/redis");
const { generateSlug } = require("myp-admin/helpers/generateSlug");
const { objectIdValidation } = require("myp-admin/http/middlewares");
const { paginationParser, updateFieldsParser } = require("myp-admin/helpers");

const {
  Models: {
    StoreSchema,
    ProductSchema,
    ProductControlSchema,
    ProductClassificationSchema,
    FileSchema
  },
  getModelByTenant,
} = require("myp-admin/database/mongo");
const { affiliateCheck } = require("myp-admin/http/middlewares/affiliate.middleware");


router.get("/:id?", objectIdValidation, async (req, res) => {
  try {
    const Store = StoreSchema.Model();
    const ProductAdminSchema = ProductSchema.Model();
    const Product = getModelByTenant(req.tenant, "ProductSchema");
    const store = await Store.findById(req.store);

    const pmcRegion = store.pmc ? store.pmc : null;
    const { id } = req.params;
    const filters = {};

    const {
      page = 1,
      limit = 20,
      query = null,
      status = null,
      category = [],
      onAdmin = false,
      manufacturer = [],
      miscellaneousFilters = [],
    } = req.query;

    if (id) {
      let product = await Product.findById(id);

      if (!product) {
        return res.status(404).json({
          error: "product_not_found",
        });
      }

      if (pmcRegion) {
        const pmcValue = product.pmcValues.find(
          (x) => x.region_id.toString() === pmcRegion._id.toString()
        );
        const pmcPrice =
          Number(product.pmcPrice) > 0
            ? product.pmcPrice
            : pmcValue
              ? pmcValue.value
              : 0;
        product.pmcPrice = pmcPrice;
      }

      return res.json({
        product,
      });
    }

    const paginationOptions = {
      page,
      limit,
      sort: { name: 1 },
      forceCountFn: true,
    };

    if (status !== null) {
      filters["status"] = status;
    }

    if (query && query.length > 0) {
      filters["$or"] = [{ EAN: query }, { name: new RegExp(query, "i") }];
    }

    if (category.length > 0) {
      filters["category._id"] = {
        $in: category.map((id) => new ObjectId(id)),
      };
    }

    if (manufacturer.length > 0) {
      filters["manufacturer._id"] = {
        $in: manufacturer.map((id) => new ObjectId(id)),
      };
    }

    if (miscellaneousFilters.length > 0) {
      miscellaneousFilters.forEach((filter) => {
        if (filter === "without_category") {
          filters["category"] = { $size: 0 };
        }

        if (filter === "without_quantity") {
          filters["quantity"] = { $eq: 0 };
        }

        if (filter === "with_quantity") {
          filters["quantity"] = { $gt: 0 };
        }

        if (filter === "low_pmc") {
          filters["pmcValues"] = { $gt: [{ $size: 0 }] };
          filters[
            "$expr"
          ] = `!!this.pmcValues.find(x => x.value >= (this.price * 3) && x.region_id =='${pmcRegion ? new ObjectId(pmcRegion._id) : ""
          }')`;
        }

        if (filter === "without_image") {
          filters["control"] = null;
          filters["$and"] = [
            {
              $or: [
                {
                  "image.key":
                    "mockups/sem-imagem-padrao.jpg",
                },
                { image: null },
              ],
            },
            {
              "image.key": {
                $ne: "mockups/generico-tarja-preta.jpg",
              },
            },
            {
              "image.key": {
                $ne: "mockups/tarja-preta-nao-generico.jpg",
              },
            },
            {
              "image.key": {
                $ne: "mockups/tarja-vermelha-nao-generico.jpg",
              },
            },
            {
              "image.key": {
                $ne: "mockups/generico-tarja-vermelha.jpg",
              },
            },
          ];
        }
        if (filter === "asc_date") {
          filters["createdAt"] = { $ne: null };
          paginationOptions.sort = { createdAt: -1 };
        }
      });
    }

    if (onAdmin) {
      const pagination = await ProductAdminSchema.paginate(
        filters,
        paginationOptions
      );
      return res.json(paginationParser("products", pagination));
    }

    const pagination = await Product.paginate(filters, paginationOptions);

    return res.json(paginationParser("products", pagination));
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "internal_server_error",
    });
  }
});

router.post("/", affiliateCheck('PRODUCT', 'UPDATE'), async (req, res) => {
  try {
    const Control = ProductControlSchema.Model();
    const Classification = ProductClassificationSchema.Model()
    const Product = getModelByTenant(req.tenant, "ProductSchema")
    const Category = getModelByTenant(req.tenant, "CategorySchema")
    const Showcase = getModelByTenant(req.tenant, "ShowCaseSchema")
    const Manufacturer = getModelByTenant(req.tenant, "ManufacturerSchema")

    const { products } = req.body;

    const promises = []
    const invalidateEans = [];
    const bulkWriteProducts = [];
    const bulkWriteShowCase = [];

    if (products instanceof Array && products.length > 0) {
      for await (const product of products) {
        let _product = {};

        Object.keys(product).forEach((key) => {
          if (
            typeof product[key] !== "object" &&
            !key.includes("_id")
          ) {
            _product[key] = product[key];
          }
        });

        if (
          product.control &&
          product.control !== 0 &&
          typeof product.control === "string"
        ) {
          const id = new ObjectId(product.control);

          _product.control = await Control.findById(id);
        }

        if (
          product.manufacturer &&
          product.manufacturer !== 0 &&
          typeof product.manufacturer === "string"
        ) {
          const id = new ObjectId(product.manufacturer);

          _product.manufacturer = await Manufacturer.findById(id);
        }

        if (
          product.classification &&
          product.classification !== 0 &&
          typeof product.classification === "string"
        ) {
          const id = new ObjectId(product.classification);

          _product.classification = await Classification.findById(id);
        }

        if (product.category && product.category instanceof Array) {
          if (
            product.category.filter((id) => typeof id === "string")
              .length > 0
          ) {
            const ids = product.category.map(
              (id) => new ObjectId(id)
            );

            _product.category = await Category.find({
              _id: { $in: ids },
            });
          }
        }

        bulkWriteProducts.push({
          updateOne: {
            filter: { _id: new ObjectId(product._id) },
            update: {
              $set: {
                ..._product,
                updatedAt: new Date(),
              },
            },
            upsert: true,
          },
        });

        let updateObj = {};

        Object.keys(_product).forEach((k) => {
          updateObj = {
            ...updateObj,
            [`products.$.product.${k}`]: _product[k],
          };
        });

        bulkWriteShowCase.push({
          updateMany: {
            filter: {
              products: {
                $elemMatch: {
                  "product._id": new ObjectId(product._id),
                },
              },
            },
            update: {
              $set: {
                ...updateObj,
                "products.$.product.updatedAt": new Date(),
              },
            },
          },
        });

        invalidateEans.push({
          tenant: req.tenant,
          ean: product.EAN,
        });
      }
      await Product.bulkWrite(bulkWriteProducts);
      await Showcase.bulkWrite(bulkWriteShowCase);

      // check if store is a head store
      if (req.flagship_store && Array(req.tenants || []).length > 0) {
        req.tenants.forEach(tenant => {
          const affiliate = tenant
          const action = req.action
          const entity = req.entity
          const mainStore = req.tenant

          promises.push(QueuePlugin.publish('affiliate-store-change', { affiliate, mainStore, data: products, action, entity }))
        })

        await Promise.all(promises)
      }

      return res.json({
        products: [],
      });
    }

    const product = await Product.findById(products._id);

    if (!product) {
      return res.status(404).json({
        error: "product_not_found",
      });
    }

    const {
      status,
      verify,
      EAN,
      MS,
      name,
      description,
      presentation,
      manufacturer = null,
      classification,
      control,
      activePrinciple,
      price,
      quantity,
      category = [],
      metaTitle,
      promotions,
      metaDescription,
      manualPMC,
      pmcPrice,
      priceLocked,
      quantityLocked,
      width,
      weight,
      length,
      height,
      image,
    } = products;

    const updateFields = updateFieldsParser({
      status,
      verify,
      EAN,
      MS,
      name,
      presentation,
      manufacturer,
      classification,
      control,
      activePrinciple,
      price,
      quantity,
      category,
      metaTitle,
      description,
      promotions,
      metaDescription,
      promotions,
      manualPMC,
      pmcPrice,
      priceLocked,
      quantityLocked,
      width,
      weight,
      length,
      height,
      image,
    });

    if (category && category.length > 0) {
      const ids = category.map((c) => new ObjectId(c._id));
      updateFields["category"] = await Category.find({
        _id: { $in: ids },
      });
    }

    if (manufacturer) {
      updateFields["manufacturer"] = await Manufacturer.findById(
        manufacturer
      );
    }

    if (control !== 0) {
      updateFields["control"] = await Control.findById(control);
    } else {
      updateFields["control"] = null;
    }

    if (classification !== 0) {
      updateFields["classification"] = await Classification.findById(
        classification
      );
    } else {
      updateFields["classification"] = null;
    }

    if (image && image.content) {
      if (
        product.image &&
        product.image.key &&
        product.image.key.includes(req.tenant)
      ) {
        await remove(product.image.key);

        if (product.image.icon) await remove(product.image.icon);
        if (product.image.thumb) await remove(product.image.thumb);
      }

      const hash = crypto.randomBytes(16).toString("hex");
      const name = `${hash}${products.image.name}`;
      const path = `${req.tenant}/product/${name}`;

      const originalContent = image.content;

      image.content = await ImageCompress(
        originalContent,
        { width: undefined, height: undefined },
        100
      );

      const icon = {
        content: await ImageCompress(
          originalContent,
          { width: 25, height: 25 },
          100
        ),
        path: `${req.tenant}/product/icon-${hash}.webp`,
      };

      const thumb = {
        content: await ImageCompress(
          originalContent,
          { width: 200, height: 140 },
          100
        ),
        path: `${req.tenant}/product/thumb-${hash}.webp`,
      };

      const { Location, Key } = await put(path, image);
      const iconUpload = await put(icon.path, icon);
      const thumbUpload = await put(thumb.path, thumb);

      updateFields["image"] = {
        name: name,
        key: Key,
        url: Location,
        thumb: thumbUpload.Key,
        icon: iconUpload.Key,
      };
    }

    await product.updateOne({
      ...updateFields,
      updatedBy: "store",
    });

    const response = await Product.findById(products._id);

    await Showcase.updateMany(
      {
        products: {
          $elemMatch: {
            "product._id": {
              $in: [response._id, response._id.toString()],
            },
          },
        },
      },
      { $set: { "products.$[element].product": response } },
      {
        arrayFilters: [
          {
            "element.product._id": {
              $in: [response._id, response._id.toString()],
            },
          },
        ],
        multi: true,
      }
    );

    await RedisService.remove(`showcase:${req.store}`);

    invalidateEans.push({
      ean: EAN,
      tenant: req.tenant,
    });

    // check if store is a head store
    if (req.flagship_store && Array(req.tenants || []).length > 0) {

      req.tenants.forEach(tenant => {
        const affiliate = tenant
        const action = req.action
        const entity = req.entity
        const mainStore = req.tenant

        promises.push(QueuePlugin.publish('affiliate-store-change', { affiliate, mainStore, data: response, action, entity }))
      })

      await Promise.all(promises)
    }

    await QueuePlugin.publish("mongo-invalidate-product", invalidateEans);

    return res.json({
      product: response,
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "internal_server_error",
    });
  }
});

router.put("/", affiliateCheck('PRODUCT', 'CREATE'), async (req, res) => {
  try {
    const Control = ProductControlSchema.Model();
    const Classification = ProductClassificationSchema.Model()

    const File = getModelByTenant(req.tenant, "FileSchema");
    const Product = getModelByTenant(req.tenant, "ProductSchema");
    const Category = getModelByTenant(req.tenant, "CategorySchema")
    const Manufacturer = getModelByTenant(req.tenant, "ManufacturerSchema")
    const promises = []
    const {
      status,
      verify,
      EAN,
      MS,
      name,
      presentation,
      manufacturer,
      classification,
      description,
      image,
      control,
      price,
      quantity,
      activePrinciple,
      category = [],
      metaTitle,
      metaDescription,
      promotions,
      manualPMC = false,
      pmcPrice = 0,
      width,
      weight,
      length,
      height,
    } = req.body;

    let obj = {
      status,
      verify,
      EAN,
      MS,
      name,
      presentation,
      manufacturer,
      classification,
      description,
      control,
      price,
      quantity,
      activePrinciple,
      category,
      metaTitle,
      promotions,
      metaDescription,
      manualPMC,
      pmcPrice,
      width,
      weight,
      length,
      height,
    };

    const productExists = await Product.findOne({ EAN });

    if (productExists) {
      return res.status(400).json({
        error: "product_alrealy_exists_on_ean",
      });
    }

    //const softDeletedProduct = await Product.find({ EAN: EAN, withDeleted:true, deleted: true, deletedAt: { $exists: true } }, )
    if (category.length > 0) {
      const ids = category.map((c) => c._id);
      obj["category"] = await Category.find({ _id: { $in: ids } });
    }

    if (manufacturer) {
      obj["manufacturer"] = await Manufacturer.findById(manufacturer);
    }

    if (control !== 0) {
      obj["control"] = await Control.findById(control);
    } else {
      obj["control"] = null;
    }

    if (classification !== 0) {
      obj["classification"] = await Classification.findById(
        classification
      );
    } else {
      obj["classification"] = null;
    }

    if (image) {
      if (image.content) {
        if (image.key && image.key.includes(req.tenant))
          await remove(oldImage.key);

        const hash = crypto.randomBytes(16).toString("hex");
        const name = `${hash}${image.name}`;
        const path = `${req.tenant}/product/${name}`;

        const originalContent = image.content;

        image.content = await ImageCompress(originalContent, {
          width: undefined,
          height: undefined,
        });

        const icon = {
          content: await ImageCompress(originalContent, {
            width: 25,
            height: 25,
          }),
          path: `${req.tenant}/product/icon-${hash}.webp`,
        };

        const thumb = {
          content: await ImageCompress(originalContent, {
            width: 200,
            height: 200,
          }),
          path: `${req.tenant}/product/thumb-${hash}.webp`,
        };

        const { Location, Key } = await put(path, image);
        const iconUpload = await put(icon.path, icon);
        const thumbUpload = await put(thumb.path, thumb);

        obj["image"] = {
          name: name,
          key: Key,
          url: Location,
          thumb: thumbUpload.Key,
          icon: iconUpload.Key,
        };
      } else {
        const newImage = await File.create({
          ...image,
          _id: undefined,
          updatedAt: new Date(),
          createdAt: new Date()
        })
        obj["image"] = newImage || null
      }
    }

    const slug = await generateSlug(obj, Product);

    obj["slug"] = [slug];

    const updatedDeletedProduct = await Product.findOneAndUpdate(
      { EAN, deleted: true },
      {
        ...obj,
        updatedAt: new Date(),
        updatedBy: "store",
        deleted: false,
        deletedAt: null,
      },
      { withDeleted: true, new: true }
    )

    // check if store is a head store
    if (req.flagship_store && Array(req.tenants || []).length > 0) {

      req.tenants.forEach(tenant => {
        const affiliate = tenant
        const action = req.action
        const entity = req.entity
        const mainStore = req.tenant

        promises.push(QueuePlugin.publish('affiliate-store-change', { affiliate, mainStore, data: product, action, entity }))
      })

      await Promise.all(promises)
    }

    const product = updatedDeletedProduct ? updatedDeletedProduct : await Product.create(obj)

    // Invalidate products
    await QueuePlugin.publish("mongo-invalidate-product", [
      {
        tenant: req.tenant,
        ean: EAN,
      },
    ]);

    return res.json({
      product,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "internal_server_error",
    });
  }
});

router.post("/status/", async (req, res) => {
  const { product = [], status = true } = req.body;
  const Product = getModelByTenant(req.tenant, "ProductSchema");
  const Showcase = getModelByTenant(req.tenant, "ShowCaseSchema");
  const invalidateEans = []
  const bulkWriteProducts = []
  const bulkWriteShowCase = []

  try {

    if (product instanceof Array && product.length > 0) {
      for await (const id of product) {
        const productDetail = await Product.findById(new ObjectId(id))

        if (productDetail) {
          bulkWriteProducts.push({
            updateOne: {
              filter: { _id: new ObjectId(id) },
              update: {
                '$set': {
                  status,
                  updatedBy: 'store',
                  updatedAt: new Date()
                }
              },
              upsert: true
            }
          })

          bulkWriteShowCase.push({
            updateMany: {
              filter: {
                products: {
                  '$elemMatch': {
                    'product._id': { $in: [new ObjectId(id), String(id).toString()] }
                  }
                }
              },
              update: {
                '$set': {
                  'products.$.product.status': status,
                  'products.$.product.updatedAt': new Date(),
                  'products.$.product.updatedBy': 'store',
                  updatedAt: new Date()
                }
              }
            }
          })

          invalidateEans.push({
            ean: productDetail.EAN,
            tenant: req.tenant
          })
        }
      }

      await Product.bulkWrite(bulkWriteProducts)
      await Showcase.bulkWrite(bulkWriteShowCase)
      await QueuePlugin.publish('mongo-invalidate-product', invalidateEans)
      await RedisService.remove(`showcase:${req.store}`)
    }

    return res.json({ ok: true })

  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
});

module.exports = router;
