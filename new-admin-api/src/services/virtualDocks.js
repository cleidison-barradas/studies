const axios = require("axios");

module.exports = axios.create({
  baseURL: process.env.VIRTUAL_DOCKS_API_URL,
});
