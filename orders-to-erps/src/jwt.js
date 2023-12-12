const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const config = require('../config.json').jwt;

// RSA Keys
const privateKey = path.join(__dirname, "../keys/private.key");
const publicKey = path.join(__dirname, "../keys/public.key");

const signOptions = {
    issuer: config.company,
    subject: config.email,
    audience: config.website,
    expiresIn: config.expiresIn,
    algorithm: config.algorithm
}

const jwtSign = (customer_id, email, password, store = {}) => {
    return new Promise((resolve, reject) => {
        const payload = {customer_id, email, password};
        const { _id, tenant = null } = store

        fs.readFile(privateKey, {encoding: 'UTF8'}, (err, raw) => {
            if (err) reject(err);
            else {
                try {
                    var token = jwt.sign(payload, raw, signOptions);
                    resolve(token);
                } catch (error) {
                    reject(error);
                }
            }
        });
    });
}

const jwtVerify = (token) => {
    return new Promise((resolve, reject) => {
        fs.readFile(publicKey, {encoding: 'UTF8'}, (err, raw) => {
            if (err) reject(err);
            else {
                try {
                    var legit = jwt.verify(token, raw, signOptions);
                    resolve(legit);
                } catch (error) {
                    reject(error);
                }
            }
        });
    });
}

module.exports = { jwtSign, jwtVerify };
