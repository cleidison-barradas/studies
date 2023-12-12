const { PAYMENT_API } = process.env
const { create } = require('apisauce')
const api = create({
  baseURL: PAYMENT_API
})
const axios = require('axios')


/**
 * 
 * @param {string} stoneChargeHash 
 * @param {string} secretKey 
 * @returns 
 */
const refoundStoneOrder = async (stoneChargeHash, secretKey) => {
  const token = Buffer.from(secretKey + ':').toString('base64').replace(' ', '')

  try {
    await axios.delete(`https://api.pagar.me/core/v5/charges/${stoneChargeHash}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Authorization": 'Basic ' + token
      }
    })
  } catch (error) {
    console.log(error)
    return 'not_ok'
  }
}


const refoundOrder = async (tenant, orderId) => {
  const response = await api.post(`v1/gateway/pagseguro/${tenant}/${orderId}`)

  return response
}

const cancelPayment = async (tenant, orderId) => {
  const response = await api.post(`v1/gateway/picpay/${tenant}/${orderId}`)

  return response
}

module.exports = { refoundOrder, cancelPayment, refoundStoneOrder }

