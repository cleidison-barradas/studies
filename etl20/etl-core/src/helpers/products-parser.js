// Utils
const logger = require('../utils/logger');

const productFilter = (product, schema) => {
    // Invalid EAN
    if (!['string', 'number'].includes(typeof product.ean)) {
        return false
    }

    const schemaFields = Object.keys(schema)
    for (const field of schemaFields) {
        if (schema[field].required && (product[field] === undefined || product[field] === null)) {
            return false
        }

        // if (schema[field].type && !!product[field] && schema[field].type !== typeof product[field]) {
        //     return false
        // }
    }

    return true
}

const productTypeFix = (product, schema) => {
    const schemaFields = Object.keys(schema)
    for (const field of schemaFields) {
        if (product[field] !== undefined) {
            if (schema[field].type) {
                if (schema[field].type === 'number') {
                    product[field] = Number(product[field].toString().replace(/,/g, '.'))
                }
                else if (schema[field].type === 'boolean') {
                    product[field] = product[field].toString() === 'true'
                }
                else {
                    product[field] = product[field].toString()
                }
            }
            else {
                product[field] = product[field] === null ? product[field] = '' : product[field].toString()
            }
        }
    }

    return product
}

/**
 * 
 * @param {Array} products 
 */
const filterValidProducts = (products = []) => {
    if (products.length <= 0) return products
    let entries = new Map([])

    products.filter(product =>
        product.price > 0 &&
        product.ean.length > 0 &&
        product.ean.length > 3 &&
        product.ean.length < 15).forEach(_product => {
            if (!entries.has(_product.ean)) {
                entries.set(_product.ean, _product)
            }
        })

    const filtred = Array.from(entries.values())

    // clean from memory
    entries = null

    return filtred
}

/**
 * Parse database origin result
 * 
 * @param {Array} result 
 */
const parseDbResult = (result, schema) => {
    return new Promise((resolve, reject) => {

        try {
            // Process product to make it compatible with our environment
            var products = [];
            result.forEach(p => {
                var obj = {};
                Object.keys(p).forEach(k => {
                    const key = k.toLowerCase();
                    var value = p[k];

                    // Check if our value is buffered, if so let's convert it to string
                    if (Buffer.isBuffer(value)) {
                        value = value.toString('utf8');
                    }

                    obj[key] = value;
                })

                products.push(obj);
            });
            logger('> Loaded products from ERP!');
            logger('> Loaded products example: ' + JSON.stringify(products[0]));

            // Filter products by schema validation
            products = products.filter(p => productFilter(p, schema))

            logger('> Removed invalid fields!');

            // Fixes fields
            products = products.map(p => {
                if (typeof p.ean !== 'string') {
                    p.ean = p.ean.toString();
                }

                p.ean = p.ean.replace(/\D/g, '').toString();
                p = productTypeFix(p, schema);

                return p;
            });

            logger('> Fix valid fields')

            products = filterValidProducts(products)

            logger(`> Parsed products. Total: ${products.length}`)

            resolve(products)

        } catch (err) {
            logger('> Failed to parse database result');
            logger(err.message)
            logger(err.stack)
            reject(err.message || err);
        }
    })
}

module.exports = {
    parseDbResult
}
