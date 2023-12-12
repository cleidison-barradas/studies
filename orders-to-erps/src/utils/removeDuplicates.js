/**
 * @param {Array<any>} products 
 */

const removeDuplicates = (products) => {
    const list = new Map([])

    products.forEach(product => {
        if (!list.has(product.EAN)) {
            list.set(product.EAN, product)
        }
    })

    const filtred = Array.from(list.values())

    return filtred
}

module.exports = removeDuplicates