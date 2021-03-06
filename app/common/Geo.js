import { markerIcon, pinIcon } from '../common/icons'
import { GeoJSON } from 'leaflet'
import toGeoJSON from '@mapbox/togeojson'
import xmldom from 'xmldom'
import { updateWaypointPosition } from '../actions/files'
import { showDrawingMenu, selectLine } from '../actions/ui'
import utils from './utils'
import editableLineOptions from '../common/editable-line-options'
const uuidv4 = require('uuid/v4')

const DOMParser = xmldom.DOMParser

class Geo {
    constructor (dispatch) {
        // this.map = map
        this.dispatch = dispatch
    }

    getWaypointFeature(name, lat, lng) {
        console.log('getWaypointFeature')
        const waypointFeature = {
            "type": "Feature",
            "properties": {
                id: uuidv4(), // set unique id
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

    // getFileFromFilesById(fileId, files) {
    //     return files.find(file => file.id === fileId)
    // }

    // addLineToLayerGroup() {
    //     const newFilesLayer = geo.createGeoJsonLayerFromFile(file, ui)
    //     newFilesLayer.addTo(map)
    // }

    /**
     * Get the layer group for file -
     * @param {object} file
     * @param {*} ui
     */
    createGeoJsonLayerFromFile(file, ui) {
        console.log('createGeoJsonLayerFromFile', file)
        const { id, featureCollection } = file
        if (!featureCollection) {
            // console.log('There is no featureCollection for file', file)
            // alert('there is no featureCollection - This is a BUG')
            return
        }
        const { features } = featureCollection


        // console.log('id :', id);
        // console.log('featureCollection :', JSON.stringify(featureCollection, null, 4));
        const dispatch = this.dispatch // dispatch is used for any actions required on the features
        // console.log('featureCollection', JSON.stringify(featureCollection, null, 4))
        console.log('featureCollection', featureCollection)
        console.log('features', features)
        if (!features) return

        // console.log('features', JSON.stringify(features, null, 4))

        // todo - this is only getting the first line in the collection
        const line = features.find(feature => feature.geometry.type === 'LineString')
        console.log('line', line)

        const resetStyle = (e) => {
            // console.log('layerGroup', e.target)
            layerGroup.resetStyle(e.target)
        }

        const layerGroup = new GeoJSON(features, {
            style: function(feature) {
                return {
                    color: line && line.properties.color || 'red',
                    weight: 3,
                }
            },

            // could I do something to reset it.  What is e.target?
            // reset: () => {
            //     // console.log('layerGroup', e.target)
            //     layerGroup.resetStyle(e.target)
            // },

            // config for each point
            pointToLayer: (pointFeature, latlng) => {
                if (!latlng) return
                const marker = L.marker(latlng, { icon: pinIcon, draggable: true })
                marker.bindPopup(pointFeature.properties.name)

                marker.on('dragend', function(event) {
                    const marker = event.target
                    const position = marker.getLatLng()
                    marker.setLatLng(position, { draggable: 'true' })

                    // todo - panning? map.panTo(new L.LatLng(position.lat, position.lng))
                    dispatch(updateWaypointPosition(id, pointFeature.properties.id, position))
                })
                return marker
            },

            /**
             * Define behaviour of lines - mouse over, click, and editable
             * @param {*} feature
             * @param {*} layer
             */
            onEachFeature: function(feature, layer) {
                if (feature.geometry.type === 'LineString') {
                    layer.on('mouseover', function() {
                        this.setStyle({
                            weight: 5
                        })
                    })
                    layer.on('mouseout', resetStyle)

                    layer.on('click', function() {
                        dispatch(showDrawingMenu())
                        dispatch(selectLine(layer.feature.properties.id))
                        resetStyle // reset style before changing it for editing - ensures it goes back to this
                        layer.pm.enable(editableLineOptions)
                        layer.id = layer.feature.properties.id  // todo - do I need this as it is in there all the time?
                    })

                    // check to see if a line is already selected and if so, make it editable
                    if (ui.selectedLineId && layer.feature.properties.id === ui.selectedLineId) {
                        layer.pm.enable(editableLineOptions)
                    }
                }
            }
        })

        layerGroup.id = id

        return layerGroup
    }

    getGeoJsonObject(fileText, fileName, fileType) {
        if (!fileType) return null

        let geojson
        if (fileType === 'geojson') geojson = JSON.parse(fileText)

        if (fileType === 'gpx') {
            const gpx = new DOMParser().parseFromString(fileText)

            geojson = toGeoJSON.gpx(gpx)
            console.log('geojson', geojson)
        }

        if (fileType === 'kml') {
            const kml = new DOMParser().parseFromString(fileText)
            geojson = toGeoJSON.kml(kml)
        }

        // now stick an id on each feature (for internal use eg moving features)
        geojson.features.forEach(feature => {
            if (!feature.properties.id) {
                const id = uuidv4()
                feature.properties.id = id // unique id for each feature
                feature.id = id // easier to use here, especially when looping thru layers which may not have properties
                // may get rid of feature.properties.id, but currently need them both - removeFeatures uses it, not sure if necessary or not
            }
        })

        return geojson
    }

    geojsonToGpx(geojson) {
        return toGpx(geojson)
    }
}

export default Geo
