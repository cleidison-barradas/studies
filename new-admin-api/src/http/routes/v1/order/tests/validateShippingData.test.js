const { isValidShippingData } = require('../order.service')

const SHIPPING_DATA = {
    "shippingCompany": "AAA",
    "shippingMethod": "BBBBB", 
    "trackCode": "CCCC", 
    "trackUrl": "DDDDD"
}

const SHIPPING_DATA_BAD = {
    "shippingCompany": "AAA",
    "shippingMethod": "BBBBB", 
    "trackCode": "CCCC", 
    "trackUrl": ""
}


test("If everything informed, should return true ", async() => {
    expect(
        isValidShippingData(SHIPPING_DATA)
    ).toBe(true)
})

test("If something not informed, should return FALSE ", async() => {
    expect(
        isValidShippingData(SHIPPING_DATA_BAD)
    ).toBe(false)

    expect(
        isValidShippingData(SHIPPING_DATA_BAD)
    ).toBe(false)
})


