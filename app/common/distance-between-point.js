
const _toRadian = degree => degree * Math.PI / 180
const EARTH_RADIUS = 6371

const service = {
    /**
     * @params {array} origin [lat, long]
     * @params {array} destination [lat, long]
     */
    calculate: (origin, destination) => {
        const lon1 = toRadian(origin[1])
        const lat1 = toRadian(origin[0])
        const lon2 = toRadian(destination[1])
        const lat2 = toRadian(destination[0])

        const deltaLat = lat2 - lat1
        const deltaLon = lon2 - lon1

        const a = Math.pow(Math.sin(deltaLat / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(deltaLon / 2), 2)
        const c = 2 * Math.asin(Math.sqrt(a))
        return c * EARTH_RADIUS * 1000
    }
}

export default service
