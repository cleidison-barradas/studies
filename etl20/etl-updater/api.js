// ApiSauce
const { create } = require('apisauce');

// Configuration
const Configuration = require('./config.json');

const api = create({
  baseURL: Configuration.api.root
});

/**
 * Routes
 */
const getUpdate = (versionCode) => api.get(`v2/app-update/${versionCode || 20}`);

module.exports = {
  getUpdate
}
