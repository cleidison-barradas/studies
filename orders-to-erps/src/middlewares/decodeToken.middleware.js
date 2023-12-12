const database = require('../database');
const uuid = require('uuid')

const decodeToken = (req, res, next) => {
    const { store_token }  = req.body;

    if (store_token === undefined) {
        res.status(403).json({
            error: 'store_not_informed'
        })
    } else {      
        if (uuid.validate(store_token)) {
            database.orderIntegration.findOne({
                where: {
                    token: store_token
                }
            }).then(result => {
                if (result === null) {
                    res.status(404).json({
                        error: 'store_not_found'
                    })
                } else {
                    const { store_id } = result;
                    req.storeId = store_id;
                    next()
                }
            })
        } else {
            res.status(400).json({
                error: 'invalid_token'
            })
        }
    }

}

module.exports = decodeToken;