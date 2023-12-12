async function getStoreCep(tenant){
    const {
        Mongo: {
            Models: { StoreSchema },
        },
    } = require("myp-admin/database")

    const Store = StoreSchema.Model()
    const store = await Store.findOne({tenant})
    return(store.settings.config_cep)
}

module.exports = { getStoreCep }