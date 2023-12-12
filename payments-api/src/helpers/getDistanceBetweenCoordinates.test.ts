import { getDistanceBetweenCoordinates, Coordinate } from './getDistanceBetweenCoordinates'
describe('getDistanceBetweenCoordinates', () => {
  it('should return 0 for the same coordinates', () => {
    const coordinate: Coordinate = {
      latitude: 40.7128,
      longitude: -74.0060,
    }

    expect(getDistanceBetweenCoordinates(coordinate, coordinate)).toBe(0)
  })

  it('should calculate the distance between two coordinates correctly', () => {
    const coordinate1: Coordinate = {
      latitude: 40.7128,
      longitude: -74.0060,
    }

    const coordinate2: Coordinate = {
      latitude: 34.0522,
      longitude: -118.2437,
    }

    const expectedDistance = 3935.746
    const allowedDifference = 1.00

    const actualDistance = getDistanceBetweenCoordinates(coordinate1, coordinate2)
    expect(Math.abs(actualDistance - expectedDistance)).toBeLessThanOrEqual(allowedDifference)
  })
})
