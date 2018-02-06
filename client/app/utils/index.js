import _ from 'lodash'
/*
 return the line part of a geojson object
 */
export const getLine = (geoJson) => {
    console.log('geoJson', geoJson)
    if (_.isEmpty(geoJson)) return null

    return geoJson.features.find(it => it.geometry.type === 'LineString')
}

export const getSelectedTrack = (tracks) => {
    console.log('tracks?', tracks)
    if (!tracks) return null

    const item = tracks.find(it => it.selected === true)
    console.log('item', item)

    return item.track
}