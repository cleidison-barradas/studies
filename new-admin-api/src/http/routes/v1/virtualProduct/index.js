const router = require("express").Router()
const crypto = require("crypto")
const { ObjectId } = require("bson")
const { QueuePlugin } = require("@mypharma/api-core")

const ImageCompress = require("myp-admin/utils/fileHelper")
const { put, remove } = require("myp-admin/services/aws")

const RedisService = require("myp-admin/services/redis")
const { generateSlug } = require("myp-admin/helpers/generateSlug")
const { objectIdValidation } = require("myp-admin/http/middlewares")
const { paginationParser, updateFieldsParser } = require("myp-admin/helpers")

const {
    Models: {
        StoreSchema,
        ProductSchema,
        ProductControlSchema,
        ProductClassificationSchema,
        VirtualProductSchema,
        NotificationSchema,
    },
    getModelByTenant,
} = require("myp-admin/database/mongo")


router.get("/:id?", objectIdValidation, async (req, res) => {
    try {
        const Store = StoreSchema.Model()
        const VirtualProductAdminSchema = VirtualProductSchema.Model()
        const Product = getModelByTenant(req.tenant, "VirtualProductSchema")
        const Notification = getModelByTenant(req.tenant, "NotificationSchema");//NotificationSchema.Model()

        const store = await Store.findById(req.store)
        const notifications = await Notification.find({
            $or: [
              { type: 'DOCAS_INTEGRATED_BUT_NOT_CUSTOMIZED_PRODUCT' },
              { type: 'DOCAS_PRODUCT_NOT_INTEGRATED' }
            ]
          })

        const eanValues = await notifications.map(notification => notification.products.map(product => product.ean)).flat()

        const pmcRegion = store.pmc ? store.pmc : null
        const { id } = req.params
        const filters = {}

        const {
            page = 1,
            limit = 20,
            query = null,
            status = null,
            category = [],
            onAdmin = false,
            manufacturer = [],
            miscellaneousFilters = [],
        } = req.query

        if (id) {
            let product = await Product.findById(id)

            if (!product) {
                return res.status(404).json({
                    error: "virtual_product_not_found",
                })
            }

            if (pmcRegion) {
                const pmcValue = product.pmcValues.find(
                    (x) => x.region_id.toString() === pmcRegion._id.toString()
                )
                const pmcPrice =
                    Number(product.pmcPrice) > 0
                        ? product.pmcPrice
                        : pmcValue
                            ? pmcValue.value
                            : 0
                product.pmcPrice = pmcPrice
            }

            return res.json({
                product,
            })
        }

        const paginationOptions = {
            page,
            limit,
            sort: { name: 1 },
            forceCountFn: true,
        }

        if (status !== null) {
            filters["status"] = status
        }

        if (query && query.length > 0) {
            filters["$or"] = [{ EAN: query }, { name: new RegExp(query, "i") }]
        }

        if (category.length > 0) {
            filters["category._id"] = {
                $in: category.map((id) => new ObjectId(id)),
            }
        }

        if (manufacturer.length > 0) {
            filters["manufacturer._id"] = {
                $in: manufacturer.map((id) => new ObjectId(id)),
            }
        }

        if (miscellaneousFilters.length > 0) {
            miscellaneousFilters.forEach((filter) => {
                if (filter === "without_category") {
                    filters["category"] = { $size: 0 }
                }

                if (filter === "without_quantity") {
                    filters["quantity"] = { $eq: 0 }
                }

                if (filter === "with_quantity") {
                    filters["quantity"] = { $gt: 0 }
                }

                if (filter === "low_pmc") {
                    filters["pmcValues"] = { $gt: [{ $size: 0 }] }
                    filters[
                        "$expr"
                    ] = `!!this.pmcValues.find(x => x.value >= (this.price * 3) && x.region_id =='${pmcRegion ? new ObjectId(pmcRegion._id) : ""
                    }')`
                }

                if (filter === "without_image") {
                    filters["control"] = null
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
                    ]
                }
                if (filter === "asc_date") {
                    filters["createdAt"] = { $ne: null }
                    paginationOptions.sort = { createdAt: -1 }
                }
            })
        }

        filters["EAN"] = { $in: eanValues }

        if (onAdmin) {
            const pagination = await VirtualProductAdminSchema.paginate(
                filters,
                paginationOptions
            )
            return res.json(paginationParser("virtualProducts", pagination))
        }

        const pagination = await Product.paginate(filters, paginationOptions)

        return res.json(paginationParser("virtualProducts", pagination))
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: "internal_server_error",
        })
    }
})

router.post("/", async (req, res) => {
    try {
        const Control = ProductControlSchema.Model()
        const Classification = ProductClassificationSchema.Model()
        const Product = getModelByTenant(req.tenant, "VirtualProductSchema")
        const Category = getModelByTenant(req.tenant, "CategorySchema")
        const Showcase = getModelByTenant(req.tenant, "ShowCaseSchema")
        const Manufacturer = getModelByTenant(req.tenant, "ManufacturerSchema")
        const Notification = getModelByTenant(req.tenant, "NotificationSchema")

        const { products } = req.body

        const product = await Product.findById(products._id)

        if (!product) {
            return res.status(404).json({
                error: "product_not_found",
            })
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
        } = products

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
        })

        if (category && category.length > 0) {
            const ids = category.map((c) => new ObjectId(c._id))
            updateFields["category"] = await Category.find({
                _id: { $in: ids },
            })
        }

        if (manufacturer) {
            updateFields["manufacturer"] = await Manufacturer.findById(
                manufacturer
            )
        }

        if (control !== 0) {
            updateFields["control"] = await Control.findById(control)
        } else {
            updateFields["control"] = null
        }

        if (classification !== 0) {
            updateFields["classification"] = await Classification.findById(
                classification
            )
        } else {
            updateFields["classification"] = null
        }

        if (image && image.content) {
            if (
                product.image &&
                product.image.key &&
                product.image.key.includes(req.tenant)
            ) {
                await remove(product.image.key)

                if (product.image.icon) await remove(product.image.icon)
                if (product.image.thumb) await remove(product.image.thumb)
            }

            const hash = crypto.randomBytes(16).toString("hex")
            const name = `${hash}${products.image.name}`
            const path = `${req.tenant}/product/${name}`

            const originalContent = image.content

            image.content = await ImageCompress(
                originalContent,
                { width: undefined, height: undefined },
                100
            )

            const icon = {
                content: await ImageCompress(
                    originalContent,
                    { width: 25, height: 25 },
                    100
                ),
                path: `${req.tenant}/product/icon-${hash}.webp`,
            }

            const thumb = {
                content: await ImageCompress(
                    originalContent,
                    { width: 200, height: 140 },
                    100
                ),
                path: `${req.tenant}/product/thumb-${hash}.webp`,
            }

            const { Location, Key } = await put(path, image)
            const iconUpload = await put(icon.path, icon)
            const thumbUpload = await put(thumb.path, thumb)

            updateFields["image"] = {
                name: name,
                key: Key,
                url: Location,
                thumb: thumbUpload.Key,
                icon: iconUpload.Key,
            }
        }

        await product.updateOne({
            ...updateFields,
            updatedBy: "store",
        })

        const response = await Product.findById(products._id)

        const matchingNotifications = await Notification.find({
            'products.ean': response.EAN
        });


        if( response.name && response.name.length>0
            &&
            response.description && response.description.length>0
            &&
            response.presentation && response.presentation.length>0
            ){
            for (const notification of matchingNotifications) {
                const indexToRemove = notification.products.findIndex(
                (product) => product.ean === response.EAN
                )
                console.log('notification._id '+notification._id)
                if (indexToRemove !== -1) {
                notification.products.splice(indexToRemove, 1)

                if (notification.products.length === 0) {
                    await Notification.findByIdAndDelete(notification._id)
                } else {
                    await Notification.updateOne(
                        { _id: notification._id },
                        { $set: notification }
                    )
                }
                }
            }
        }

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
        )

        RedisService.remove(`showcase:${req.store}`)

        return res.json({
            product: response,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: "internal_server_error",
        })
    }
})

module.exports = router
