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

class Geo {
    constructor (dispatch) {
        // this.map = map
        this.dispatch = dispatch
    }

    getWaypointFeature(name, lat, lng) {
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

    getGeoJsonLayer(fileName, fileId, features, ui) {
        // todo - this is only getting the first line in the collection
        const line = features.find(feature => feature.geometry.type === 'LineString')

        const resetStyle = (e) => {
            console.log('layerGroup', e.target)
            trackLayerGroup.resetStyle(e.target)
        }

        const trackLayerGroup = new GeoJSON(features, {
            style: function(feature) {
                return {
                    color: line && line.properties.color || 'red',
                    weight: 3,
                }
            },

            pointToLayer: (pointFeature, latlng) => {
                if (!latlng) return
                const marker = L.marker(latlng, { icon: markerIcon, draggable: true })
                marker.bindPopup(pointFeature.properties.name)

                marker.on('dragend', function(event) {
                    const marker = event.target
                    const position = marker.getLatLng()
                    marker.setLatLng(position, { draggable: 'true' })

                    // todo - panning? map.panTo(new L.LatLng(position.lat, position.lng))
                    dispatch(updateWaypointPosition(fileName, pointFeature.properties.id, position))
                })
                return marker
            },

            onEachFeature: function(feature, layer) {
                if (feature.geometry.type === 'LineString') {
                    layer.on('mouseover', function() {
                        this.setStyle({
                            weight: 5
                        })
                    })
                    layer.on('mouseout', resetStyle)

                    layer.on('click', function() {
                        layer.off('mouseout', resetStyle)
                        console.log('onClick - showDrawingMenu', layer.feature.properties.id)
                        dispatch(showDrawingMenu())
                        dispatch(selectLine(layer.feature.properties.id))
                        layer.pm.enable(editableLineOptions)
                        layer.id = layer.feature.properties.id  // todo - do I need this as it is in there all the time?
                    })
                    // check to see if a line is already selected and if so, make it editable
                    if (ui.selectedLineId && layer.feature.properties.id === ui.selectedLineId) {
                        // todo - how come this doesn't work?
                        layer.pm.enable(editableLineOptions)
                        console.log('made editable', layer.pm.enabled())
                    }
                }
            }
        })

        trackLayerGroup.id = fileId

        return trackLayerGroup
    }

    getGeoJsonObject(fileText, fileName) {
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
                feature.properties.id = uuidv4() // unique id for each feature
            }
        })

        return geojson
    }
}
export default Geo
