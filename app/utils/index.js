import { isEmpty } from 'lodash'
import moment from 'moment'
/*
 return the line part of a geojson object
 */
export const getLine = (geoJson) => {
    console.log('geoJson', geoJson)
    if (isEmpty(geoJson)) return null

    return geoJson.features.find(it => it.geometry.type === 'LineString')
}

/*
tracks is as stored in reducx
 */
export const getSelectedTrack = (tracks) => {
    console.log('tracks?', tracks)
    if (!tracks) return null

    const item = tracks.find(it => it.selected === true)
    console.log('item', item)

    return item.track
}

export const getDistanceBetween2Points = (origin, destination) => {
    // console.log('origin', origin)
    // console.log('destination', destination)
    // return distance in meters
    var lon1 = _toRadian(origin[1]),
        lat1 = _toRadian(origin[0]),
        lon2 = _toRadian(destination[1]),
        lat2 = _toRadian(destination[0])

    var deltaLat = lat2 - lat1
    var deltaLon = lon2 - lon1

    var a = Math.pow(Math.sin(deltaLat/2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(deltaLon/2), 2)
    var c = 2 * Math.asin(Math.sqrt(a))
    var EARTH_RADIUS = 6371
    return c * EARTH_RADIUS * 1000
}
const _toRadian = (degree) => {
    return degree * Math.PI/180
}

export const getMillisecsBetween2Points = (origin, destination) => {
    return moment(destination).diff(moment(origin))
}


