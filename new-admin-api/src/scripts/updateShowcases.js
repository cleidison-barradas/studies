require('dotenv').config()
const {getStores} = require('./helpers/getStores.js')
const Config = require('../config')
const { ORM, ShowcaseRepository, ProductRepository} = require('@mypharma/api-core')
const RedisService = require('../services/redis.js')
const { ObjectId } = require('bson')

exports.default = (async () => {
    ORM.config = Config.databases.mongoConfig 
    await ORM.setup()
    
    const stores = await getStores()
    
    for await (const store of stores) {
        let bukerWriteShowcase = []
        await ORM.setup(null,store.tenant)
        const showcases = await ShowcaseRepository.repo(store.tenant).find()
        for await (let showcase of showcases) {
            await ShowcaseRepository.repo(store.tenant).updateMany({"products.product" : null},{$pull : {"products" : {product : null}}})
            const showcaseProducts = showcase.products.filter(_p => _p.product && _p.product.EAN)
            const eans = showcaseProducts.map(product => product.product.EAN)

            let newProduct = []

            const products = await ProductRepository.repo(store.tenant).find({
                where: {EAN: {$in:eans}}
            })

            products.forEach(_product => {
                const index = showcaseProducts.findIndex(showcaseProduct => showcaseProduct.product.EAN.toString() === _product.EAN.toString())
                const exists = newProduct.filter(p => p.EAN === _product.EAN).length > 1
                if (index !== -1) {
                    if (exists){
                        showcase.product.splice(index,1)
                    } else {
                        newProduct.push({
                            position: showcase.products[index].position,
                            product: _product
                        })
                    }
                } 
            })

            const id = showcase._id
            delete showcase._id

            bukerWriteShowcase.push({
                updateOne:{
                    filter:{_id: new ObjectId(id)}, 
                    update:{
                        '$set':{
                                products: newProduct,
                                updatedAt: new Date()
                            }
                        }, 
                    upsert: true
                }
            })
        }
        if (bukerWriteShowcase.length > 0){
            await ShowcaseRepository.repo(store.tenant).bulkWrite(bukerWriteShowcase)
            bukerWriteShowcase = []
            await RedisService.remove(`showcase:${store._id}`)
            console.log("Atualizou a Vitrine!")
        }

    }

    console.log("end")
    process.exit(0)
})()

