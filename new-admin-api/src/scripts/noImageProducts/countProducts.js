const { ORM, ProductRepository, StoreRepository, Product } = require('@mypharma/api-core')

async function countProducts(eans) {
    const stores = await StoreRepository.repo().find()
    const tenants = stores.map(store => store.tenant)
    const parcialProducts = new Map([])

    for await (const tenant of tenants) {
        await ORM.setup(null, tenant)

        eans.forEach(ean => {
            parcialProducts.set(ean, {
            ean,
            rank: 1
            })
        })
        
            const products = await ProductRepository.repo(tenant).find({
              select: ["EAN"],
              where: { "EAN": {$in:eans}}
            })
        
            products.forEach(_product => {
                if (parcialProducts.has(_product.EAN)) {
                    let prod = parcialProducts.get(_product.EAN)
                    prod.rank += Number(prod.rank)

                    parcialProducts.delete(_product.EAN)

                    parcialProducts.set(_product.EAN, prod)
                }
            })
    }
    return parcialProducts
}

module.exports = {countProducts}