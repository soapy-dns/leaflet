'use strict'
import { markerIcon } from '../common/icons'
import { GeoJSON } from 'leaflet'

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
export const getGeoJsonLayer = (featureCollection) => {
    const line = featureCollection.features.find(feature => feature.geometry.type === 'LineString')
    console.log('line', line)

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
                layer.on('mouseout', function () {
                    trackLayerGroup.resetStyle(this)
                })
                layer.on('click', function () {
                    console.log('select1')
                    layer.off(mouseout, mouseout())
                    dispatch(selectTrack(track))
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