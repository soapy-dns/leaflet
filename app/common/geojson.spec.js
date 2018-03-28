import { getWaypointFeature } from './geojson'

describe('geojson.js', () => {
    test('getWaypointFeature returns a correctly set waypoint', () => {
        const name = 'TEST_NAME'
        const lat = -33, lng = 155

        const waypoint = getWaypointFeature(name, lat, lng)

        expect(waypoint.properties.id).toBeDefined()
        expect(waypoint.properties.name).toBe(name)
        expect(waypoint.geometry.coordinates[0]).toBe(lng)
        expect(waypoint.geometry.coordinates[1]).toBe(lat)
    })
})

