'use strict'
import {markerIcon} from '../common/icons'
import {GeoJSON} from 'leaflet'
import toGeoJSON from '@mapbox/togeojson'
import xmldom from 'xmldom'

const DOMParser = xmldom.DOMParser

export const getWaypointFeature = (name, lat, lng) => {
    const waypointFeature = {
        "type": "Feature",
        "properties": {
            "name": name,
        },
        "geometry": {
            "type": "Point",
            "coordinates": [
                lng,
                lat,
                null
            ]
        }
    }

    return waypointFeature
}

/*
 get a geoJSON object from a feature collection
 */
export const getGeoJsonLayer = (featureCollection, map) => {
    const line = featureCollection.features.find(feature => feature.geometry.type === 'LineString')

    const mouseOut = (e) => {
        console.log('layerGroup', e.target)
        trackLayerGroup.resetStyle(e.target)
    }

    const trackLayerGroup = new GeoJSON([featureCollection], {
        style: function (feature) {
            return {
                color: line.properties.color || 'red',
                weight: 3,
            }
        },
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {icon: markerIcon})
        },
        onEachFeature: function (feature, layer) {
            if (feature.geometry.type === 'LineString') {
                layer.on('mouseover', function () {
                    this.setStyle({
                        weight: 5
                    })
                })
                layer.on('mouseout', mouseOut)
                // layer.on('mouseout', function () {
                //     console.log('this', this)
                //     trackLayerGroup.resetStyle(layer)
                // })
                layer.on('click', function () {
                    layer.off('mouseout', mouseOut)
                    // dispatch(selectTrack(track))  // will need to implement something like this, only dispatch isn't known here

                    // need to change everything to waypoint
                    feature.geometry.coordinates.forEach(coord => {
                        // const marker = L.marker([coord[1], coord[0]]).addTo(map)
                        // add a Point feature
                        const feature = getWaypointFeature('TEMP', coord[1], coord[0])
                        featureCollection.features.push(feature)

                        //save them?

                    })

                    this.setStyle({
                        weight: 5,
                        dashArray: '5, 10, 7, 10, 10, 10'
                    })
                })
            }
        }
    })

    return trackLayerGroup
}


const _ext = (filename) => {
    return (extension) => {
        return filename.indexOf(extension) !== -1
    }
}

const _getFileType = (fileName) => {
    const lowerCaseFileName = fileName ? fileName.toLowerCase() : ''

    const ext = _ext(lowerCaseFileName)

    if (ext('.kml')) return 'kml'

    if (ext('.gpx')) return 'gpx'

    if (ext('.geojson') || ext('.json') || ext('.topojson')) return 'geojson'

    return null
}

export const getGeoJson = (fileText, fileName) => {
    const fileType = _getFileType(fileName)

    if (!fileType) return null

    if (fileType === 'geojson') return JSON.parse(fileText)

    if (fileType === 'gpx') {
        const gpx = new DOMParser().parseFromString(fileText)

        return toGeoJSON.gpx(gpx)
    }

    if (fileType === 'kml') {
        const kml = new DOMParser().parseFromString(fileText)
        return toGeoJSON.kml(kml)
    }
}