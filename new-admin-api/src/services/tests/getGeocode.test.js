const axios = require('axios')
const { updateStoreLocation } = require('../getGeocode')

jest.mock('axios')

describe('updateStoreLocation', () => {
  it('should return the latitude and longitude if geocode results are available', async () => {
    const getAddressGeocode = jest.fn().mockResolvedValue({
      results: [
        {
          lat: 123.456,
          lon: 789.012,
        },
      ],
    })

    const store = {
      settings: {
        config_address_latitude: undefined,
        config_address_longitude: undefined,
        config_cep: '12345-678',
        config_address: 'Test Address',
        config_store_number: '123',
        config_store_city: 'Test City',
      },
    }

    const config_cep = '12345-678'
    const config_address = 'Test Address'
    const config_store_number = '123'
    const config_store_city = 'Test City'

    axios.get.mockResolvedValueOnce({
      data: {
        results: [
          {
            lat: 123.456,
            lon: 789.012,
          },
        ],
      },
    })

    const result = await updateStoreLocation(
      store,
      config_cep,
      config_address,
      config_store_number,
      config_store_city
    )

    expect(getAddressGeocode).not.toHaveBeenCalled()
    expect(result).toEqual({
      latitude: 123.456,
      longitude: 789.012,
    })
  })

})

