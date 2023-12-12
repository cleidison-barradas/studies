require('dotenv').config()
const fs = require('fs')
const { parse } = require('csv-parse')
const path = require('path')
const { ORM, ProductRepository } = require("@mypharma/api-core")
const Config = require('./config')

const csv = path.join(__dirname, 'produtos.csv')
const tenant = 'farmaciasfronteira'

exports.default = (async () => {

    let productEans = []
    ORM.config = Config.databases.mongoConfig
    await ORM.setup()

    fs.createReadStream(csv)
        .pipe(parse({delimiter:";"}))
        .on("data", async row => {
            productEans.push(row[1])
    })

    setTimeout(async() => {
        await ORM.setup(null, tenant)

        console.log(productEans.length)
        productEans.forEach(async EAN => {
            const product = await ProductRepository.repo(tenant).findOne({EAN: EAN})
            product !== undefined ? console.log(product) : {}
            await ProductRepository.repo(tenant).updateOne({EAN: EAN}, {$set: {deletedAt: new Date()}})
        })
        console.log("DONE DONE DONE")
    }, 5000)

    
})()
