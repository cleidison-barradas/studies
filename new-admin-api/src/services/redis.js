const IORedis = require('ioredis')

class RedisClient {
    client

    init(options) {
        this.client = new IORedis(options)
        console.log("Redis initting")
    }

    set(key, data) {
        return this.client.set(key, this.parseToString(data))
    }

    setWithExpire(key, data, expire) {
        return this.client.set(key, this.parseToString(data), 'EX', expire)
    }

    async push(key, data, expireAt) {
        try {
            if (data instanceof Array) {
                // Push entire new array with pipeline
                const pipeline = this.client.pipeline()
                data.forEach((item) => pipeline.rpush(key, this.parseToString(item)))

                // Run pipeline
                await pipeline.exec()
            } else {
                await this.client.rpush(key, this.parseToString(data))
            }

            if (expireAt && expireAt > 60) {
                await this.expireAt(key, expireAt)
            }
            return true
        } catch {
            return false
        }
    }

    async get(key, start, end) {
        try {
            if (start === undefined) {
                const data = await this.client.get(key)
                return this.parseToJson(data)
            } else {
                const data = await this.client.lrange(key, start, end || -1)
                return this.parseListToJson(data)
            }
        } catch (err) {
            console.log(key, start, end)
            console.log(err)
            return null
        }
    }

    async remove(key) {
        try {
            await this.client.del(key)
            return true
        } catch {
            return false
        }
    }

    async exists(key) {
        try {
            const exists = await this.client.exists(key)
            return exists > 0 ? true : false
        } catch {
            return false
        }
    }

    async hexists(key, field) {
        try {
            const exists = await this.client.hexists(key, field)
            return exists > 0 ? true : false
        } catch {
            return false
        }
    }

    async hget(key, field = null) {
        try {
            if (field) {
                const data = await this.client.hget(key, field)
                return this.parseHashToObject(data)
            } else {
                const data = await this.client.hgetall(key)
                return this.parseHashToObject(data)
            }
        } catch {
            return null
        }
    }

    expireAt(key, expireAt) {
        return this.client.expireat(key, expireAt)
    }

    persist(key) {
        return this.client.persist(key)
    }

    parseToJson(input) {
        if (typeof input !== 'string') return input

        try {
            return JSON.parse(input)
        } catch {
            return null
        }
    }

    parseListToJson(list) {
        return list.map((item) => this.parseToJson(item))
    }

    parseToString(input) {
        return JSON.stringify(input)
    }

    parseHashToString(input) {
        Object.keys(input).forEach((k) => {
            const value = input[k]
            if (typeof value === 'object') {
                input[k] = this.parseToString(value)
            }
        })

        return input
    }

    parseHashToObject(input) {
        Object.keys(input).forEach((k) => {
            const value = input[k]
            if (value.includes('{') || value.includes('[')) {
                input[k] = this.parseToJson(value)
            }
        })

        return Object.keys(input).length === 0 ? null : input
    }
}

module.exports = new RedisClient()
