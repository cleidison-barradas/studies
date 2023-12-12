const rp = require('request-promise')
const queryString = require('query-string')
const isDev = require('../utils/isDevelopment')

const {
  GOOGLE_ACCESS_TOKEN,
  GOOGLE_GET_PROFILE,
  AUTH_REDIRECT,
  DEV_LOCAL_ORIGIN = 'http://localhost:3000'
} = process.env

const { facebook, google } = require('../config')

/**
 * Get Url Login Facebook
 * @param {Object} store config
 */
const getUrlLoginFB = (store) => {
  const url = isDev() ? DEV_LOCAL_ORIGIN : store.url

  const stringifieldParams = queryString.stringify({
    client_id: facebook.client_id,
    redirect_uri: `${AUTH_REDIRECT}/auth`,
    scope: ['email', 'public_profile'].join(','),
    state: [url, 'facebook'].join(',')
  });

  return `${facebook.loginUlr}${stringifieldParams}`
}

/**
 * Get access token from facebook
 *
 * @param {String} clientId config
 * @param {String} clientSecret config
 * @param {String} redirect_uri url callback
 * @param {String} code code from frontend
 * @returns access token
 */
const getAcessTokenFB = async (code) => {

  const response = await rp({
    uri: `${facebook.baseUrl}/oauth/access_token?`,
    method: 'GET',
    json: true,
    qs: {
      client_id: facebook.client_id,
      client_secret: facebook.secret,
      redirect_uri: `${AUTH_REDIRECT}/auth`,
      code
    }
  })
  return response;
}

/**
 * Get facebook profile
 *
 * @param {String} accessToken
 */
const getProfileFB = async (accessToken) => {

  const response = await rp({
    uri: `${facebook.baseUrl}/me?`,
    method: 'GET',
    json: true,
    qs: {
      fields: ['id', 'email', 'first_name', 'last_name'].join(','),
      access_token: accessToken
    }
  })
  return response;
}

/**
 * Get Url Login Google
 * @param {Object} store store
 */
const getUrlLoginGO = (store) => {
  const redirectUri = `${AUTH_REDIRECT}/auth`
  const url = isDev() ? DEV_LOCAL_ORIGIN : store.url

  const stringifieldParams = queryString.stringify({
    client_id: google.client_id,
    redirect_uri: redirectUri,
    prompt: 'consent',
    response_type: 'code',
    access_type: 'offline',
    scope: ['profile', 'email'].join(' '),
    state: [url, 'google'].join(','),
  })


  return `${google.loginUlr}${stringifieldParams}`
}

/**
 * Get access token after user give permission
 * @param {String} code code
 */
const getAccessTokenGO = async (code) => {
  const uri = GOOGLE_ACCESS_TOKEN

  const response = await rp({
    uri,
    method: 'POST',
    json: true,
    body: {
      client_id: google.client_id,
      client_secret: google.secret,
      redirect_uri: `${AUTH_REDIRECT}/auth`,
      grant_type: 'authorization_code',
      code,
    }
  })

  return response
}

/**
 * Get google profile
 *
 * @param {String} access_token token access
 * @param {String} id_token token id
 */
const getProfileGO = async (id_token) => {
  const uri = GOOGLE_GET_PROFILE

  const response = await rp({
    uri,
    method: 'GET',
    json: true,
    qs: {
      id_token
    }
  })
  return response
}

module.exports = {
  getUrlLoginFB,
  getAcessTokenFB,
  getProfileFB,

  getUrlLoginGO,
  getAccessTokenGO,
  getProfileGO,
}
