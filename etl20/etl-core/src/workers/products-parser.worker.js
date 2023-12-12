// Worker Threads
const { workerData, parentPort } = require('worker_threads');

// Helpers
//const { parseDbResult } = require('../helpers/products-parser');

/**
 * Parse database origin result
 * 
 * @param {Array} result 
 */
const parseDbResult = (result) => {
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

            // Remove invalid EANs, NAMES and PRICES
            //products = products.filter(p => (typeof p.ean === 'string' || typeof p.ean === 'number') && typeof p.name === 'string' && Number(p.price) > 0);
            products = products.filter(p => p.name.length > 0); // Name cannot be empty
    
            // Fixes fields
            products = products.map(p => {
                if (p.ean && typeof p.ean !== 'string') {
                    p.ean = p.ean.toString();
                }
                
                p.ean = p.ean.replace(/\D/g,'').toString();
                p.price = Number(p.price.replace(/,/g, '.'));
                p.quantity = Number(p.quantity).toFixed(0);
    
                return p;
            });
    
            // EAN cannot be empty
            products = products.filter(p => p.ean.length > 0);

            // Prices cannot be zero
            products = products.filter(p => p.price > 0);
    
            // Remove duplicates eans
            products = products.sort((a, b) => a.ean - b.ean).filter((product, index, self) => {
                return self.findIndex(x => x.ean === product.ean) === index;
            });
    
            // Grab only valid eans
            products = products.filter(p => p.ean.length > 3 && p.ean.length < 15);
    
            resolve(products);
        } catch (err) {
            reject(err.message || err);
        }
    })
}

module.exports = (async () => {
    try {
        // Get product sent throught worker data
        const { products } = workerData;

        // Parser products
        const parsedProducts = await parseDbResult(products);
        
        // Return to main thread the detal
        setTimeout(() => {
            parentPort.postMessage({
                parsedProducts,
                total: parsedProducts.length
            });
        }, 1000);

    } catch (error) {
        throw error;
    }

})()
