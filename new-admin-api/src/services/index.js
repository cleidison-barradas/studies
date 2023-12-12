/**
 * BSA Services
 */

// JWT Service
const jwt = require('./jwt')
const redis = require('./redis')
const { databases } = require('../config')
/**
 * Some services requires an initialization before the API goes up
 * here we gonna initializes these services
 */
const init = async () => {
    // Initialize JWT
    try {
        await jwt.init()
        redis.init(databases.redis)
    } catch (err) {
        throw new Error("Redis")
    }
}

module.exports = {
    init,
    jwt,
}
