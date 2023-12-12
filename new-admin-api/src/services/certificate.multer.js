/* eslint-disable no-param-reassign */
const crypto = require('crypto')
const aws = require('aws-sdk')
const multerS3 = require('multer-s3')
const configS3 = require('../config')

// remove special chars but keep extension
const regex = /[^a-zA-Z0-9-._]+|\.(?![a-zA-Z0-9]+\b)/g

const storageTypes = {
    certificate: multerS3({
        s3: new aws.S3(configS3.s3),
        bucket: configS3.s3._bucket,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        key: (req, file, cb) => {
            crypto.randomBytes(16, (err, hash) => {
                if (err) cb(err)
                const filename = `${req.tenant}/certificate/${file.originalname.replace(regex, "")}`
                cb(null, filename)
            })
        },
    }),
}

module.exports = {
    storage: storageTypes.certificate,
    fileFilter: (req, file, cb) => {
        const allowedMimes = ['application/x-pkcs12']
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new Error('Invalid file type'))
        }
    },
    remove: (key) => {
        const s3 = new aws.S3(configS3.s3)
        s3.deleteObject({
            Bucket: `${configS3.s3._bucket}`,
            Key: key,
        })
            .promise()
            .then((response) => {
                return response
            })
            .catch((err) => {
                console.log(err)
            })
    },
}
