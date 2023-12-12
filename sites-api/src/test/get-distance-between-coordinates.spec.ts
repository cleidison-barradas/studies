import { getDistanceBetweenCoordinates } from '../helpers/get-distance-between-coordinates'


describe('Get Distance Between Coordinates', () => {
  it('should be able return 0 for identical coordinates', () => {
    const coordinate = { latitude: 1, longitude: 2 }
    expect(getDistanceBetweenCoordinates(coordinate, coordinate)).toBe(0)
  })

  it('should be able calculate the distance correctly', () => {
    const coordinate1 = { latitude: 52.520008, longitude: 13.404954 } // Berlin
    const coordinate2 = { latitude: 48.856613, longitude: 2.352222 } // Paris
    const distance = getDistanceBetweenCoordinates(coordinate1, coordinate2)

    expect(distance).toEqual(877.4164725672964)
  })
})