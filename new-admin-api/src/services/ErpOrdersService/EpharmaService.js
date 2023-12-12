const axios = require('axios')
const { epharma: { baseURL } } = require('../../config')
class EpharmaService {
  /**
   * @param {object} params
   * @param {object} params.settings
   */
  constructor({ settings }) {
    const username = settings['config_epharma_username']
    const password = settings['config_epharma_password']
    const client_id = settings['config_epharma_clientId']
    const cnpj = settings['config_cnpj'].replace(/[^0-9]+/g, '')

    if (!username || !password || !client_id || !cnpj) {

      throw Error('missing_epharma_credentials')
    }

    this.cnpj = cnpj
    this.username = username
    this.password = password
    this.client_id = client_id

    this._client = axios.default.create({
      baseURL
    })
  }

  async authenticate() {

    try {

      const { data } = await this._client.get('/authentication/api/v1/OAuth/Authenticate', {
        headers: {
          username: this.username,
          password: this.password,
          client_id: this.client_id
        }
      })

      if (data.error) {
        console.log(data.error.message)
        throw new Error(data.error)
      }

      const accessToken = data.data.token.accessToken

      return accessToken

    } catch (error) {
      console.log(error)
      throw new Error('failure_on_authenticate_epharma')
    }
  }

  /**
   * 
   * @param {object} params
   * @param {Array} params.items
   * @param {string} params.accessToken
   * @param {object} params.fiscalDocument
   * @param {string} params.storeSequenceId
   * @param {number} params.authorizationId
   * @param {string} params.elegibilityToken
   */
  async createPbmSale({ items, accessToken, fiscalDocument, storeSequenceId, authorizationId, elegibilityToken }) {

    items = items.map(_item => {
      return {
        categoryId: 0,
        ean: _item.ean,
        salePrice: _item.salePrice,
        productName: _item.productName,
        quantity: _item.approvedQuantity,
        storePrice: _item.storeMaximumPrice,
        storeMaximumPrice: _item.storeMaximumPrice,
      }
    })

    try {
      const response = await this._client.post('/transaction/api/v1/Sale',
        {
          items,
          fiscalDocument,
          storeSequenceId,
          authorizationId,
          storeCnpj: this.cnpj,
        },
        {
          headers: {
            elegibilityToken: elegibilityToken,
            Authorization: `Bearer ${accessToken}`
          }
        })

      return response

    } catch ({ response }) {
      console.log(response.data.errors)
      return null
    }
  }

  /**
   * 
   * @param {object} params
   * @param {string} params.accessToken
   * @param {string} params.storeSequenceId
   * @param {string} params.saleId
   * @param {Date} params.saleDate
   * @param {object} params.fiscalDocument
   * @param {Array} params.items
   */

  async cancelPbmSale({ accessToken, storeSequenceId, saleId, saleDate = new Date(), fiscalDocument, items }) {
    try {

      items = items.map(_p => {
        return {
          ean: _p.ean,
          quantity: _p.approvedQuantity
        }
      })

      const response = await this._client.post('/transaction/api/v1/Sale/Return', {
        items,
        saleId,
        saleDate,
        fiscalDocument,
        storeSequenceId,
        storeCnpj: this.cnpj,
      },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })

      return response.data

    } catch (response) {
      console.log(response)
      return null
    }
  }
}

module.exports = EpharmaService