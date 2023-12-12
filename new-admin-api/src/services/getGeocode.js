const axios = require('axios')
const { GEAOAPIFY_KEY } = process.env

async function getAddressGeocode(postalCode, address, number, city) {
    const url = `https://api.geoapify.com/v1/geocode/search?housenumber=${encodeURIComponent(number)}&street=${encodeURIComponent(address)}&postcode=${encodeURIComponent(postalCode)}&city=${encodeURIComponent(city)}&country=Brasil&format=json&apiKey=${GEAOAPIFY_KEY}`

    try {
      const response = await axios.get(url)
      return response.data
    } catch (error) {
      console.error("Error:", error)
      return null
    }
  }

  async function getStoreLocationIfNeeded(store) {
    try {
      const hasLatitude = store.settings.config_address_latitude !== undefined &&
      store.settings.config_address_latitude !== 0
      const hasLongitude = store.settings.config_address_longitude !== undefined &&
          store.settings.config_address_longitude !== 0

      if (!hasLatitude && !hasLongitude) {
          return await updateStoreLocation(
            store,
            store.settings.config_cep,
            store.settings.config_address,
            store.settings.config_store_number,
            store.settings.config_store_city
          )
        }

      return null
    } catch (error) {
      console.error("Error:", error)
      return null
    }
  }

  async function updateStoreLocation(store, config_cep, config_address, config_store_number, config_store_city) {
    try {
      const hasLatitude = store.settings.config_address_latitude !== undefined
      const hasLongitude = store.settings.config_address_longitude !== undefined
      const isAddressChanged =
          config_cep !== store.settings.config_cep ||
          config_address !== store.settings.config_address ||
          config_store_number !== store.settings.config_store_number ||
          config_store_city !== store.settings.config_store_city

      if (!hasLatitude || !hasLongitude || isAddressChanged) {
          const geocode = await getAddressGeocode(config_cep, config_address, config_store_number, config_store_city)
          if (geocode.results.length > 0) {
            if(geocode.results[0].lat && geocode.results[0].lon){
              const latitude = geocode.results[0].lat
              const longitude = geocode.results[0].lon
              return { latitude, longitude }
            }
            else{
              return { error: 'Invalid latitude and longitude' }
            }
          } else {
              return { error: 'Could not fetch latitude and longitude' }
          }
      }

      return { message: 'Latitude and longitude are already up to date' }
    } catch (error) {
      console.error("Error:", error)
      return {error: error}
    }
}


  module.exports = {
    getAddressGeocode,
    updateStoreLocation,
    getStoreLocationIfNeeded
  }