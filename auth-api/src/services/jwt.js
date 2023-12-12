// Node RSA
const NodeRSA = require('node-rsa')
// JsonWebToken
const jwt = require('jsonwebtoken')
// TokenGen
const TokenGenerator = require('uuid-token-generator')
// Database
const {
  Mongo: { Models },
} = require('../database');
// Utils
const {
  logger,
  constants: { Color },
} = require('../utils');
// JWT config
const { jwt: jwtConfig } = require('../config')
// Auth
const { getUrlLoginFB, getUrlLoginGO } = require('myp-admin/utils/oauth')

/**
 * Just create the keys if doesn't exists :P
 */
const init = () => getKeyPair();

/**
 * Get RSA keys pairs
 *
 */
const getKeyPair = async () => {
  const { KeySchema } = Models;
  const KeyModel = KeySchema.Model(); // Load model

  // Check if keys exists
  let keys = await KeyModel.findOne({
    name: 'jwt',
  });

  // If keys does not exists, create them!
  if (!keys) {
    logger('Generating JWT keys pairs...', Color.FgYellow);

    const rsa = new NodeRSA({ b: 256 });
    const keyPair = rsa.generateKeyPair();

    const privateKey = keyPair.exportKey('pkcs1-private');
    const publicKey = keyPair.exportKey('pkcs1-public');

    keys = await KeyModel.create({
      name: 'jwt',
      privateKey,
      publicKey,
    });

    logger('JWT keys pairs were generated!', Color.FgGreen);
  }

  return {
    privateKey: keys.privateKey,
    publicKey: keys.publicKey,
  };
};

/**
 * Sign a new JWT token for usage
 *
 * @param {Object} payload
 * @param {String} payload.objectId
 * @param {String} payload.email
 */
const jwtSign = async (payload = { objectId, email }) => {
  const { privateKey } = await getKeyPair();

  const token = jwt.sign(payload, privateKey, jwtConfig);
  return token;
};

/**
 * Verify a JWT token
 *
 * @param {String} token
 */
const jwtVerify = async (token) => {
  const { publicKey } = await getKeyPair();

  const payload = jwt.verify(token, publicKey, jwtConfig);
  return payload;
};


/**
 * Handle user token, refresh or create, same thing :P
 *
 * @param {Object} user
 * @param {String} tenant
 */
const userTokenHandler = async (user, store = {}) => {
  const { tenant = '', _id = '', affiliateStores = [], mainStore = false } = store

  // Token generator
  const tokenGen = new TokenGenerator(512, TokenGenerator.BASE71)

  // Generate a refresh token
  const refreshToken = tokenGen.generate()


  // Generate an access token
  const accessToken = await jwtSign({
    store: _id,
    tenant: tenant,
    objectId: user._id,
    flagship_store: mainStore,
    affiliate_scope: affiliateStores
  })

  // Update user refresh token
  await user.updateOne({
    refreshToken
  })

  return {
    refreshToken,
    accessToken
  }
}

const signStoreToken = (storeID, tenant) => {

  return jwtSign({
    objectId: storeID,
    tenant: tenant,
    store: storeID
  })
}

const startupStore = async (store = {}) => {
  const { tenant = '', _id = '', settings } = store
  let googleUrl = null
  let facebookUrl = null

  const accessToken = await jwtSign({
    objectId: _id,
    tenant: tenant,
    store: store._id
  })

  const { config_social_login = false } = settings

  if (config_social_login) {
    googleUrl = getUrlLoginGO(store)
    facebookUrl = getUrlLoginFB(store)
  }

  return {
    accessToken,
    googleUrl,
    facebookUrl
  }
}


module.exports = {
  init,
  jwtSign,
  jwtVerify,
  startupStore,
  signStoreToken,
  userTokenHandler,
};
