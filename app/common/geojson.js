'use strict'
import { markerIcon } from '../common/icons'
import { GeoJSON } from 'leaflet'
import toGeoJSON from '@mapbox/togeojson'
import xmldom from 'xmldom'
const uuidv4 = require('uuid/v4')
import { updateWaypointPosition } from '../actions/files'
import { showDrawingMenu, selectLine } from '../actions/ui'
import utils from './utils'
import editableLineOptions from '../common/editable-line-options'

const DOMParser = xmldom.DOMParser

export const getWaypointFeature = (name, lat, lng) => {
    const waypointFeature = {
        "type": "Feature",
        "properties": {
            id: uuidv4(),
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
export const getGeoJsonLayer = (fileName, featureCollection, dispatch, map, ui) => {
    // todo - this is only getting the first line in the collection
    const line = featureCollection.features.find(feature => feature.geometry.type === 'LineString')

    const resetStyle = (e) => {
        console.log('layerGroup', e.target)
        trackLayerGroup.resetStyle(e.target)
    }

    const trackLayerGroup = new GeoJSON([featureCollection], {
        style: function(feature) {
            return {
                color: line.properties.color || 'red',
                weight: 3,
            }
        },
        pointToLayer: (pointFeature, latlng) => {
            // console.log('dispatch', dispatch)
            if (!latlng) return
            // console.log('add marker', latlng.lat, latlng.lng)
            const marker = L.marker(latlng, { icon: markerIcon, draggable: true })
            marker.bindPopup(pointFeature.properties.name)

            marker.on('dragend', function(event) {
                const marker = event.target
                const position = marker.getLatLng()
                // console.log('position', position)
                marker.setLatLng(position, { draggable: 'true' })
                // console.log('featureCollection', featureCollection)

                // marker.setLatLng(new L.LatLng(latlng.lat, latlng.lng),{draggable:'true'});
                // map.panTo(new L.LatLng(position.lat, position.lng))
                dispatch(updateWaypointPosition(fileName, pointFeature.properties.id, position))
            })
            return marker
        },
        onEachFeature: function(feature, layer) {
            // console.log('layerId', trackLayerGroup.getLayerId(layer))
            console.log('layerId', layer._leaflet_id)  // not defined at this point
            if (feature.geometry.type === 'LineString') {
                layer.on('mouseover', function() {
                    this.setStyle({
                        weight: 5
                    })
                })
                layer.on('mouseout', resetStyle)

                /*
                 A Function that will be called once for each created Feature, after it has been created and styled.
                 Useful for attaching events and popups to features. The default is to do nothing with the newly created layers:
                 */
                layer.on('click', function() {
                    layer.off('mouseout', resetStyle)
                    console.log('onClick - showDrawingMenu', layer._leaflet_id) // todo - can store this
                    dispatch(showDrawingMenu())

                    // dispatch (selectLine (layer.feature.properties.id))
                    dispatch(selectLine({ leaflet_id: layer._leaflet_id, id: layer.feature.properties.id }))


                    console.log('layer leafletId before edit enable', layer._leaflet_id)
                    layer.pm.enable(editableLineOptions)
                    layer.id = 123
                    console.log('made editable', layer.pm.enabled())
                    console.log('layer leafletId after edit enable', layer._leaflet_id, 'id', layer.id)

                    // TODO.  THIS ACTUALLY SEEMS TO CREATE A NEW LEAFLET LAYER, BUT ONLY AFTER WE HAVE EXITED!!!!!!!
                    //AND ANYTHING WE ADD TO IT GETS WIPED

                    // layer.pm.disable()
                    // console.log('made disabled', layer.pm.enabled())

                })
                // check to see if a line is already selected and if so, make it editable
                if (ui.lineSelectedIds && layer._leaflet_id === ui.lineSelectedIds.leaflet_id) {

                    // if (layer.feature.properties.id === ui.lineSelected) {
                    // todo - how come this doesn't work?
                    layer.pm.enable(editableLineOptions)
                    console.log('made editable', layer.pm.enabled())
                }
            }
        }
    })

    return trackLayerGroup
}

/*
 turn file into a geojson object for jpx, kml and geojson type files
 */
export const getGeoJsonObject = (fileText, fileName) => {
    let geojson
    const fileType = utils.getFileType(fileName)

    if (!fileType) return null

    if (fileType === 'geojson') geojson = JSON.parse(fileText)

    if (fileType === 'gpx') {
        const gpx = new DOMParser().parseFromString(fileText)

        geojson = toGeoJSON.gpx(gpx)
    }

    if (fileType === 'kml') {
        const kml = new DOMParser().parseFromString(fileText)
        geojson = toGeoJSON.kml(kml)
    }

    // now stick an id on each feature (for internal use eg moving features)
    geojson.features.forEach(feature => {
        if (!feature.properties.id) {
            feature.properties.id = uuidv4()
        }
    })

    return geojson
}