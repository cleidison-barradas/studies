const requestsRules = require('../requests');

const rules = (req, res, next) => {
    // That's not a GET, right?
    if (req.method !== 'GET') {
        var requestUrl = req.originalUrl;
        if (requestUrl[requestUrl.length - 1] === '/') requestUrl = requestUrl.substring(0, requestUrl.length - 1);

        var request = requestsRules.find(p => p.request === requestUrl);

        if (request == undefined) next();
        else {
            // Grab body from request object
            const { body } = req;
            var missingFields = [];

            request.body
            .filter(p => p.required === true) // Get only required fields
            .map(p => p.name) // Leave only the names
            .forEach(field => {
                // Check if field has been passed
                if (body[field] === undefined) {
                    if (typeof body[field] === 'string' && body[field].trim().length === 0) return;
                    
                    missingFields.push(field);
                }
            });

            // Set default values
            request.body
            .filter(p => p.required === false) // Get only optional fields
            .forEach(p => {
                const { defaultValue, name } = p;

                // Does field has default value?
                if (defaultValue !== undefined) {
                    // Does the field was passed?
                    if (body[name] === undefined) {
                        req.body[name] = defaultValue;
                    }
                }
            });

            // There's something missing?
            if (missingFields.length > 0) {
                res.status(403).json({
                    status: 'error',
                    message: 'Missing required fields',
                    requiredFields: missingFields
                });
            } else {
                // It's OK! Go on
                next();
            }
        }
    } else {
        setTimeout(() => {
            next();
        }, 1000)
    }
}

module.exports = rules;