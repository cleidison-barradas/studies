const moment = require('moment')

async function objectFactory(fullPrice = null, filialStorage = null, discountedPrice = null, sku = null, pmc = null){

    let obj =  {
        updatedAt: new Date(),
    }
    if(sku !== null) obj.sku = sku
    if(fullPrice !== null) obj.price = fullPrice
    if(filialStorage !== null) obj.quantity = filialStorage
    if(discountedPrice !== null){
        obj.specials = [
            {
                date_end: moment().add(1, 'month').utc().toDate(),
                date_start: new Date(),
                price: discountedPrice
            }
        ]

    }
    if(pmc !== null) obj.erp_pmc = pmc
    
    
    return obj
}

module.exports = objectFactory

