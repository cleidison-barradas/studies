/* eslint-disable no-param-reassign */
const crypto = require('crypto');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
const configS3 = require('../config');

const storageTypes = {
  s3: multerS3({
    s3: new aws.S3(configS3.s3),
    bucket: configS3.s3._bucket,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read',
    key: (req, files, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) cb(err);
        const filename = `${hash.toString('hex')}-${files.originalname}`;
        cb(null, `${req.body.folder}/${filename}`);
      });
    },
  }),
};

module.exports = {
  storage: storageTypes.s3,
  fileFilter: (req, files, cb) => {
    const allowedMimes = [
      'image/jpeg',
      'image/pjpeg',
      'image/png',
      'image/gif',
    ];
    if (allowedMimes.includes(files.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
};
