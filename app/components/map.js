import React, { Component } from 'react'
import L, { Control, Marker, Map, GeoJSON, LayerGroup } from 'leaflet'
import { BasemapLayer, TiledMapLayer } from 'esri-leaflet'
import { toLatLon } from 'utm'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { cloneDeep } from 'lodash'
import moment from 'moment'
// import { DragDropContext } from 'react-dnd'
import 'leaflet.pm'
const uuidv4 = require('uuid/v4')
// import { Dimmer, Loader, Image, Segment } from 'semantic-ui-react'

import Api from '../utils/api'
import Collections from './collections/collections'
import MainMenu from './menu/main-menu'
import TrackMenu from './menu/track-menu'
import Locate from './locate-modal'
import Help from './help-modal'
import AwaitingFunctionality from './awaiting-functionality-modal'
import LoadTrackModal from './load-track-modal'
import WaypointModal from './waypoint-modal'
import RemoveFileModal from './collections/remove-file-modal'
import RemoveFeatureModal from './collections/remove-feature-modal'
import Elevation from '../components/stats/elevation'
import utils from '../common/utils'
import MouseControl from '../common/Mouse-control'

import { selectTrack } from '../actions/tracks'
import {
    newFile,
    addFile,
    addFeatureToFile,
    updateFile,
    removeFileFromStore
} from '../actions/files'
import { saveMapDetails } from '../actions/current'
import {
    toggleElevation,
    selectFile,
    selectLatLng,
    clearLatLng,
    showDrawingMenu,
    showMainMenu,
    unselectLine
} from '../actions/ui'
import { getSelectedTrack, getLine, getDistanceBetween2Points, getMillisecsBetween2Points } from '../utils/index'
import { flameIcon, startIcon, markerIcon, pinIcon } from '../common/icons'
import { geojsonLineMarkerOptions } from '../common/marker-options'
import Geo from '../common/Geo'

let initialTrack = {
    type: "FeatureCollection",
    features: [
        {
            "type": "Feature",
            "properties": {
                "name": "current",
                "time": "",
                "color": "red"
            }
        }
    ]
}

let map

let overlayLayers
let layersControl
// let currentTrackLayerGroup
// const fileLayerGroups = []
let drawingLayer // the layer used to keep the drawing details (when drawing)

let geo

const _getInitialLineGeojsonFeature = (latlng) => {
    console.log('_getInitialLineFeature')
    return {
        type: "Feature",
        properties: {
            name: "",
            time: "",
            color: 'red'
        },
        geometry: {
            type: "LineString",
            coordinates: []
        }
    }
}

// creates line by from the current track geojson (not sure where this is stored now.
// for each point in a line add a waypoint aswell as a point in a line

// HOLD ON - THIS MIGHT BE MY ANCIENT EFFORT - CAN I RE-USE THE EDIT
/**
 * create a new 'drawing layer' - later we will add it to the appropriate layer group
 * @param {object} e
 */
const onDrawLineClick = (e) => {
    console.log('onDrawLineClik');
    // get the layer associated with the open file
    const { selectedFileId } = this.props

    const currentGeoJson = currentTrackLayerGroup.toGeoJSON()

    // get all the Points
    const pointFeatures = currentGeoJson.features.filter(it => it.geometry.type === 'Point')

    // get the one and only line (do we want to restrict to 1 line?)
    let lineFeature = currentGeoJson.features.find(it => it.geometry.type === 'LineString')
    if (!lineFeature) lineFeature = _getInitialLineGeojsonFeature(e.latlng)

    pointFeatures.push(waypointFeature)

    //add waypointFeature coords to line
    lineFeature.geometry.coordinates.push([e.latlng.lng, e.latlng.lat])

    // create temp waypoint
    const points = L.geoJSON(pointFeatures, {
        // each point will be converted to a marker with the defined options
        pointToLayer: function (feature) {
            const featureLatlng = [feature.geometry.coordinates[1], feature.geometry.coordinates[0]]
            if (feature.properties.type !== "user") {
                return L.circleMarker(featureLatlng, geojsonLineMarkerOptions);
            } else {
                return L.marker(featureLatlng, pinIcon)
            }
        }
    })
    const line = L.geoJSON(lineFeature, {
        style: function (feature) {
            return { color: feature.properties.color };
        },
        onEachFeature: function (feature, layer) {
            if (feature.properties && feature.properties.name) {
                layer.bindPopup(feature.properties.name);
            }
        }
    })

    // clear current track group layer before re-adding
    currentTrackLayerGroup.clearLayers()

    // add to group
    currentTrackLayerGroup.addLayer(points)
    currentTrackLayerGroup.addLayer(line)
}

/**
 * update the file on the map (separate from redux)
 * @param {*} file
 * @param {*} ui
 * @param {*} geo
 */
const _refreshFileOnMap = (file, ui, geo) => {
    map.eachLayer(layer => {
        if (layer.id === file.id) {
            map.removeLayer(layer)
            const newGeoJsonLayer = geo.createGeoJsonLayerFromFile(file, ui)
            newGeoJsonLayer.addTo(map)
        }
    })
}

// const _removeFileFromMap = (fileId) => {
//     map.eachLayer(layer => {
//         if (layer.id === file.id) {
//             map.removeLayer(layer)
//         }
//     })
// }


class EditMap extends Component {
    constructor(props) {
        super(props)
        // this.onLocationError = this.onLocationError.bind(this)
        // this.onLocationFound = this.onLocationFound.bind(this)
        this.onCancelAction = this.onCancelAction.bind(this)
        this.showAwaitingFunctionalityModal = this.showAwaitingFunctionalityModal.bind(this)
        this.showLocateModal = this.showLocateModal.bind(this)
        this.showOpenFileModal = this.showOpenFileModal.bind(this)
        this.onLocate = this.onLocate.bind(this)
        this.onOpenFile = this.onOpenFile.bind(this)
        this.centreOnCurrentLocation = this.centreOnCurrentLocation.bind(this)
        this.addWaypoint = this.addWaypoint.bind(this)
        this.addWaypointOnClick = this.addWaypointOnClick.bind(this)
        this.newFile = this.newFile.bind(this)
        this.getMajorIncidents = this.getMajorIncidents.bind(this)
        this.autoCorrectTrack = this.autoCorrectTrack.bind(this)
        this.showElevationPlot = this.showElevationPlot.bind(this)
        this.hideElevationPlot = this.hideElevationPlot.bind(this)
        this.onSelectFile = this.onSelectFile.bind(this)
        this.onSelectFeature = this.onSelectFeature.bind(this)
        this.onEdit = this.onEdit.bind(this)
        this.onRemoveFile = this.onRemoveFile.bind(this)
        this.removeFile = this.removeFile.bind(this)
        this.onRemoveFeature = this.onRemoveFeature.bind(this)
        this.removeFeature = this.removeFeature.bind(this)
        this.onCancelDraw = this.onCancelDraw.bind(this)
        this.onStopLineEdit = this.onStopLineEdit.bind(this)
        this.drawLine = this.drawLine.bind(this)
        this.stopDrawLine = this.stopDrawLine.bind(this)
        this.showHelpModal = this.showHelpModal.bind(this)
        this.addLineToFile = this.addLineToFile.bind(this)
        this.waypointModal = this.waypointModal.bind(this)

        this.state = {
            locate: false,
            modal: null,
            removeFileId: null,
            removeFeatureId: null,
            loading: true
        }
    }

    /*
    NOTE
     here will be a layer added for everything.  geojson layers, markers line
    NOTE
     */
    componentDidMount() {
        const { dispatch, current, ui, files } = this.props
        // console.log('dispatch', dispatch)

        geo = new Geo(dispatch)


        const baseLayer = new BasemapLayer('Gray')

        // topo layer
        const topoLayer = new TiledMapLayer({
            // url: 'http://maps.six.nsw.gov.au/arcgis/rest/services/public/NSW_Topo_Map/MapServer',
            url: 'http://maps4.six.nsw.gov.au/arcgis/rest/services/sixmaps/LPIMap/MapServer',
            maxZoom: 17,
            maxNativeZoom: 15
        })

        // satellite image layer
        // const imageLayer = new TiledMapLayer({
        //     // url: 'http://maps.six.nsw.gov.au/arcgis/rest/services/public/NSW_Imagery/MapServer'
        //     url: 'http://maps2.six.nsw.gov.au/arcgis/rest/services/sixmaps/LPI_Imagery_Best/MapServer'
        // })

        const baseMaps = {
            "Base": baseLayer,
        }

        const center = current.center || [-33.668759325519204, 150.34924333915114]
        const zoom = current.zoom || 14
        map = new Map('mapid', {
            center: center,
            zoom: zoom,
            maxZoom: 19,
            maxNativeZoom: 14,  // don't request tiles with a zoom > this (cos they don't exist)
            layers: [baseLayer, topoLayer],
            // layers: [baseLayer],
            editable: true
        })
        map.on('moveend', function (e) {
            dispatch(saveMapDetails({ center: map.getCenter(), zoom: map.getZoom() }))
        })
        const addLineToFile = this.addLineToFile

        map.on('pm:drawend', function (e) {
            console.log('drawend');
            // add to open file
            // dispatch(addFeatureToFile(waypointFeature, ui.selectedFileId))

            addLineToFile(drawingLayer.toGeoJSON()) // add line to file in redux
        })
        map.on('pm:drawstart', function (e) {
            drawingLayer = e.workingLayer
        })
        map.zoomControl.setPosition('bottomright')


        // define overlay layers for control
        overlayLayers = {
            "Topo": topoLayer,
            // "Satellite": imageLayer
        }

        // add control button for layers - still need to the layersControl, maybe not the buttom
        layersControl = new Control.Layers(baseMaps, overlayLayers)
        // layersControl.addTo(map)

        // add mouse control
        const mouseControl = new MouseControl()
        mouseControl.setPosition('topright')

        mouseControl.addTo(map)

        //add scale
        const scale = new Control.Scale()
        scale.setPosition('topright')
        scale.addTo(map)

        // each file is becomes a layerGroup which is added to the map
        files.forEach(file => {
            console.log('PROCESSING FILE', file)
            const layerGroup = geo.createGeoJsonLayerFromFile(file, ui)


            layerGroup.addTo(map)
        })
        // map.eachLayer(layer => {
        //     console.log('layer', layer.id, layer)
        // })
    }

    /**
     *
     * @param {*} feature
     * Issues - getting the file in this method and in the dispatch action
     * passing too many complicated objects around in an unobvious manner
     */
    addLineToFile(feature) {
        console.log('addLineToFile');
        const { dispatch, files, ui } = this.props
        const { selectedFileId } = ui

        if (feature.properties.name === undefined) feature.properties.name = moment().format() // add default name
        feature.properties.id = uuidv4()


        const file = files.find(it => it.id === selectedFileId) // we do seem to find this file here, and in the addFeatureToFile action which seems wastefull
        if (file) {
            // todo - one method uses fileId and the other uses file.  should make it consistent
            dispatch(addFeatureToFile(feature, selectedFileId))
            _refreshFileOnMap(file, ui, geo)
        } else {
            alert('todo - add new file if none exists yet')
        }
    }

    onCancelAction() {
        this.setState({ modal: null })
    }

    /*
     convert form data to lat / long and move the map to that point (and turn off the modal)
     */
    onLocate(locateData) {
        const { latitude, longitude } = toLatLon(locateData.easting, locateData.northing, locateData.zone, undefined, false)
        // console.log('latitude', latitude, 'longitude', longitude)
        map.panTo(new L.LatLng(latitude, longitude))
        this.setState({ modal: null })
    }

    newFile(fileName) {
        console.log('Todo - add new file.')
    }

    onRemoveFile(fileId) {
        this.setState({ modal: 'removeFile', removeFileId: fileId })
    }

    removeFile() {
        const { dispatch, ui } = this.props

        dispatch(removeFileFromStore(this.state.removeFileId))

        if (ui.selectedFileId === this.state.removeFileId) dispatch(selectFile(null, null)) // clear selectedFileId

        _removeFileFromMap(removeFileId)
        // map.eachLayer(layer => {
        //     // console.log('layer.id', layer.id)
        //     // console.log('fileId', this.state.removeFileId)
        //     if (layer.id === this.state.removeFileId) map.removeLayer(layer)
        // })

        this.setState({ modal: null, removeFileId: null })

        // todo - removes from the collections, but not from the map
    }

    onRemoveFeature(featureId) {
        console.log('on remove feature', featureId)
        this.setState({ modal: 'removeFeature', removeFeatureId: featureId })
    }

    /*
     removes the feature from the file, and marks the file as altered

     TODO - IF LAST FEATURE IN FILE  - DO WE NOT SHOW THE DELETE ICON??  SOME ISSUE WITH DRAG AND DROP.  SAVE EMPTY FILE = REMOVE IT?
     */
    removeFeature() {
        console.log('removeFeature', this.state.removeFeatureId)
        // const { dispatch, files, ui, removeFeatureId } = this.props

        // // find the file that contains the feature
        // const foundFile = files.find(file => {
        //     const foundFeature = file.featureCollection.features.find(feature => {
        //         return feature.id === removeFeatureId
        //     })
        //     return !!foundFeature
        // })

        // // find index of feature
        // const featureIndex = foundFile.featureCollection.features.findIndex(feature => feature.id === removeFeatureId)

        // const updatedFile = cloneDeep(foundFile).featureCollection.features.splice(featureIndex, 1)

        // dispatch(updateFile(updatedFile))
        // this.setState({ modal: null, removeFeatureId: null })
        // _refreshFileOnMap(updatedFile, ui, geo)
    }

    onEdit() {
        console.log('onEdit')
    }

    showLocateModal(e) {
        console.log('showLocateModal', e)
        this.setState({ modal: 'locate' })
    }

    showAwaitingFunctionalityModal() {
        this.setState({ modal: 'awaitingFunctionality' })
    }

    /*
     show open track modal
     */
    showOpenFileModal() {
        // console.log('showOpenFile')
        this.setState({ modal: 'openTrack' })
    }

    showHelpModal() {
        // console.log('showHelp - change modal state to help')
        this.setState({ modal: 'help' })
    }

    showElevationPlot() {
        console.log('show elevationPlot')
        this.props.dispatch(toggleElevation(true))
        // todo think I need to update
    }

    hideElevationPlot() {
        // console.log('hideElevationPlot')
        this.props.dispatch(toggleElevation(false))
    }

    /*
     save the FeatureCollection to redux
     That will trigger an update.
     */
    onOpenFile(fileText, fileName, fileId) {
        const { dispatch, ui } = this.props

        const featureCollection = geo.getGeoJsonObject(fileText, fileName)

        const file = {
            name: fileName,
            id: fileId,
            featureCollection
        }

        const newFilesLayer = geo.createGeoJsonLayerFromFile(file, ui)
        newFilesLayer.addTo(map)

        // set bounds to fit this new layer
        map.fitBounds(newFilesLayer.getBounds())

        // add to redux
        dispatch(addFile(featureCollection, fileName, fileId))
        dispatch(selectFile(fileId))

        // turn modal off
        this.setState({ modal: null })
    }

    getMajorIncidents() {
        // todo - move to redux
        //https://stackoverflow.com/questions/43871637/no-access-control-allow-origin-header-is-present-on-the-requested-resource-whe
        // flames = https://assets-cdn.github.com/images/icons/emoji/unicode/1f525.png
        Api.getMajorIncidents().then(data => {
            console.log('MAJOR INCIDENTS - %J', data)
            // create waypoint
            const majorIncidents = L.geoJSON(data.data, {
                // each point will be converted to a marker with the defined options
                pointToLayer: function (feature, latlng) {
                    // return L.circleMarker(e.latlng, geojsonMarkerOptions);
                    return L.marker(latlng, { icon: flameIcon })
                    // L.marker([51.5, -0.09], {icon: greenIcon}).addTo(map);

                },
                // onEachFeature: function (feature, latlng) {
                //     console.log('open modal')
                //     // todo - allow a popup to be set to add content / change the marker
                // }
                onEachFeature: function (feature, layer) {
                    if (feature.properties && feature.properties.title) {
                        layer.bindPopup(feature.properties.title);
                    }
                }
            })

            // add track to overlay layers
            overlayLayers['Major Incidents'] = majorIncidents

            // add track layer to layer control
            layersControl.addOverlay(majorIncidents, 'Major Incidents')

            majorIncidents.addTo(map)
            // dispatch(contactFormSuccess());
        }).catch((err) => {
            console.log('ERROR getting major incidents', err)
            // dispatch(contactFormFailed(err.message));
        });
    }

    autoCorrectTrack() {
        const { ui, files } = this.props
        // find the selected track
        let selectedLine
        if (ui.selectedLineId) {
            selectedLine = utils.getSelectedLine(ui.selectedLineId, files)
        }
        if (!selectedLine) return
        // const selectedTrack = getSelectedTrack(tracks)
        // // console.log('selectedTrack', selectedTrack)
        // const line = getLine(selectedTrack)
        // console.log('line', line)
        const coordinates = cloneDeep(selectedLine.geometry.coordinates)
        const coordTimes = cloneDeep(selectedLine.properties.coordTimes)

        // console.log('coordinates', coordinates)
        console.log('coordTimes', coordTimes)
        const distances = []
        const limit = coordinates.length - 1
        for (let i = 0; i < limit; i++) {
            distances.push(getDistanceBetween2Points(coordinates[i], coordinates[i + 1]))
        }
        console.log('distances', distances)

        const times = []
        for (let i = 0; i < limit; i++) {
            times.push(getMillisecsBetween2Points(coordTimes[i], coordTimes[i + 1]))
        }

        const speeds = []
        console.log('times', times)
        const numberOfElements = distances.length - 1
        for (let i = 0; i < numberOfElements; i++) {
            // time in ms, distance m, convert to km / hour
            speeds.push(distances[i] * 3600 / times[i])
        }
        console.log('speeds', speeds)

        const maxSpeed = 3 // want to make variable
        const minSpeed = 2
        const updatedSpeeds = []
        for (let i = 0; i < numberOfElements; i++) {

            // remove coordinates and times where there was no movement.
            if (speeds[i] < minSpeed || speeds[i] > 10) {
                distances.splice(i, 1)
                times.splice(i, 1)
                coordinates.splice(i + 1, 1)
                coordTimes.splice(i + 1, 1)
            } else {
                updatedSpeeds.push(speeds[i])
            }
        }

        console.log('new speeds', updatedSpeeds)
        console.log('new distances', distances)
        console.log('new times', times)

        // now build a new track
        const newLine = cloneDeep(selectedLine)
        newLine.geometry.coordinates = coordinates
        newLine.properties.coordTimes = coordTimes

        // todo - copy over other features
        let newtracksLayer
        // create new geojson layer for this track
        newtracksLayer = new GeoJSON([newLine], {
            style: function (feature) {
                return {
                    // color: line.properties.color || 'red',
                    color: 'green',
                    weight: 3,
                };
            },
            onEachFeature: function (feature, layer) {
                layer.on('mouseover', function () {
                    this.setStyle({
                        weight: 5
                    })
                })
                layer.on('mouseout', function () {
                    newtracksLayer.resetStyle(this)
                })
                layer.on('click', function () {
                    console.log('select3')
                    layer.off(mouseout, mouseout())
                    dispatch(selectTrack(newtracksLayer))
                    this.setStyle({
                        weight: 5,
                        dashArray: '5, 10, 7, 10, 10, 10'
                    })
                })
            }
        })

        // add track to overlay layers
        const trackName = 'Corrected Track'
        overlayLayers[trackName] = newtracksLayer

        // add track layer to layer control
        console.log('TODO - layersControl is undefined here')
        layersControl.addOverlay(newtracksLayer, trackName)


        console.log('autocorrect the current track')
        // const currentGeoJson = currentTrackLayerGroup.toGeoJSON()
        // https://github.com/hypertrack/time-aware-polyline-js/blob/master/src/polyline.js

        //douglas peuker implemantation
        // this isn't going to work on a circular route
        // http://bl.ocks.org/helderdarocha/47fff819307ef8488607007ebb4f8b92

        // https://stackoverflow.com/questions/27250353/circular-approximation-of-polygon-or-its-part/27251997#27251997

        // https://stackoverflow.com/questions/43167417/calculate-distance-between-two-points-in-leaflet

        // https://stackoverflow.com/questions/16121236/smoothing-gps-tracked-route-coordinates
        // filters.max_possible_travel = function(data) {
        //     //http://en.wikipedia.org/wiki/Preferred_walking_speed
        //     //I switched to 16, as the route was made by driving with a bus...
        //     var maxMetersPerSec = 16,
        //         i, m, last, result = [];
        //
        //     for(i=0;i<data.length;i++) {
        //         m = data[i];
        //         if (last) {
        //             // seconds between current and last coord
        //             var diff = (m.created.getTime() - last.created.getTime()) / 1000;
        //             // the maximum amount of meters a person,bus,car etc can make per sec.
        //             var maxDistance = diff * maxMetersPerSec;
        //             // the actual distance traveled
        //             var traveledDistance = google.maps.geometry.spherical.computeDistanceBetween(last.googLatLng, m.googLatLng);
        //
        //             if (traveledDistance > maxDistance) {
        //                 continue;
        //             } else {
        //                 result.push(m);
        //             }
        //         }
        //         last = m;
        //     }
        //     return result;
        // };

        //loop thru the track, correcting it using stnd params (which I'll allow to be changed sometime)

        //check that there are times in the track
    }

    centreOnCurrentLocation() {
        map.locate({ setView: true })
        map.on('locationerror', onLocationError)
        map.on('locationfound', onLocationFound)

        function onLocationError(e) {
            alert(e.message)
        }

        function onLocationFound(e) {
            // console.log('onLocation found', e)
            var radius = e.accuracy / 2
            // console.log(`you are within ${radius} meters from this point`)


            L.circle(e.latlng, {
                color: '#3ad',
                fillColor: '#30f',
                fillOpacity: 0.5,
                radius
            }).addTo(map).bindPopup("You are located within this circle").openPopup()
        }
    }


    /*
     remove crosshairs cursor and click functionality
     */
    stopDrawLine() {
        const { ui } = this.props
        console.log('stopDrawLine')

        // stop editing existing line
        if (ui.selectedLineId) {
            this.props.dispatch(showMainMenu())
            return this.onStopLineEdit()
        }

        // stop drawing a new line
        map.pm.disableDraw('Line')
        this.props.dispatch(showMainMenu())

        // L.DomUtil.removeClass(map._container, 'leaflet-crosshair')
        // map.off('click', onDrawLineClick)
    }

    /*
     Stop drawing the line without saving any changes
     This means removing the drawing menu and not showing the editable waypoints of the track.
     */
    onCancelDraw() {
        // need to know which line we are dealing with, so this has be be saved on clicking the track to start drawing
        this.props.dispatch(showMainMenu())
        this.props.dispatch(unselectLine())
        // trackLayerGroup.pm.disable()
        // also need to remove waypoints and stuff from the line being edited
    }

    /*
     request to start drawing a line
     change cursor and add click functionality
     // todo - may change to use pm
     */
    drawLine() {
        const { dispatch } = this.props
        console.log('drawLine')
        // L.DomUtil.addClass(map._container, 'leaflet-crosshair')
        // map.on('click', onDrawLineClick)
        map.pm.enableDraw('Line', { snappable: false });
        dispatch(showDrawingMenu())
    }

    /*
     GeoJson extends FeatureGroup, which extends LayerGroup, so
     we can add extra GeoJson Layers to the layer group

     open the modal for adding / modifying details of the waypoint
     */
    waypointModal() {
        // change cursor to crosshairs
        L.DomUtil.addClass(map._container, 'leaflet-crosshair')

        map.on('click', this.addWaypointOnClick)
    }

    /*
     waypoint has been selected.  Store its details in state, update the cursor, and remove the listener
     */
    addWaypointOnClick(e) {
        const { dispatch } = this.props

        // save latlng
        dispatch(selectLatLng(e.latlng.lat, e.latlng.lng))

        //open waypont modal
        this.setState({ modal: 'waypoint' })

        // turn off waypoint select
        L.DomUtil.removeClass(map._container, 'leaflet-crosshair')

        map.off('click', this.addWaypointOnClick)
    }

    /*
     actually add the waypoint
     add to the selected collections feature list.
     if no selected collection create a new collection, select it and add to it.
     it will always be possible to move the waypoint afterwards
     */
    /*
     The problem
     add to the state, and add to the map
     also fiddling with properties here

     solution
     we never update the map directly - it always comes from the state
     */
    addWaypoint(featureData) {
        const { dispatch, ui, files } = this.props

        const waypointFeature = geo.getWaypointFeature(featureData.pointName, ui.selectedLatitude, ui.selectedLongitude)

        console.log('ui', ui)
        if (ui.selectedFileId) {
            this.setState({ modal: null })

            // find the file we are dealing with
            const foundFile = utils.getFileById(files, ui.selectedFileId)

            // add the new waypoint to the features
            const fileFeatures = Object.assign([], foundFile.featureCollection)
            fileFeatures.push(waypointFeature)

            const file = {
                id: foundFile.id,
                name: foundFile.name,
                featureCollection: {
                    features: [fileFeatures]
                }
            }

            const layerGroup = geo.createGeoJsonLayerFromFile(file, ui)

            layerGroup.addTo(map)

            // ADD TO REDUX
            dispatch(addFeatureToFile(waypointFeature, ui.selectedFileId))
            dispatch(clearLatLng())  // clear the selected lat lng (for resetting based on the waypoint?)
        } else {
            // create new file and add waypoint
            const file = {
                id: uuidv4(), // give file a unique id
                name: fmoment().format('YYYY-MM-DD hh:mm:ss'),
                featureCollection: {
                    features: [waypointFeature]
                }
            }
            const newFilesLayer = geo.createGeoJsonLayerFromFile(file, ui)
            newFilesLayer.addTo(map)

            // ADD TO REDUX
            dispatch(newFile(featureCollection, fileName))
            dispatch(selectFile(fileName, fileId))
            this.setState({ modal: null })
        }
    }

    /*

     */
    onSelectFile(fileId) {
        // todo use fileId rather than fileName
        console.log('map - onSelectFile', fileId)
        this.props.dispatch(selectFile(fileId))
    }

    onSelectFeature(id) {
        console.log('onSelectFeature')
        // this.props.dispatch(selectFile(collectionName))

    }

    onStopLineEdit() {  // ISN'T USED BUT SHOULD BE FOR EDITING
        console.log('--onStopLineEdit--')
        const { ui, dispatch, files } = this.props

        // NOTE:- the line has already been updated in leaflet.  Just need to disable editing, and update redux

        map.eachLayer(layer => {
            if (layer.id === ui.selectedLineId) {
                layer.pm.disable() // disable editing

                dispatch(unselectLine()) // update state as this line is no longer selected for editing
                dispatch(showMainMenu())
            }

            if (layer.id === ui.selectedFileId) { // save updated file in state
                const geoJson = layer.toGeoJSON()
                const newFile = files.find(it => it.id === layer.id)
                newFile.featureCollection = geoJson

                dispatch(updateFile(newFile))
            }
        })
    }

    render() {
        // console.log('render')
        const { ui, currentLayer, files, dispatch } = this.props
        // console.log('state', this.state)
        const { modal } = this.state
        // console.log('modal', modal)
        let selectedLine
        if (ui.selectedLineId) {
            selectedLine = utils.getSelectedLine(ui.selectedLineId, files)
        }

        return (
            <div id="mapwrap">
                {(modal === 'locate') ? (
                    <Locate cancelAction={this.onCancelAction} okAction={this.onLocate} />
                ) : null}
                {(modal === 'help') ? (
                    <Help cancelAction={this.onCancelAction} />
                ) : null}
                {(modal === 'awaitingFunctionality') ? (
                    <AwaitingFunctionality cancelAction={this.onCancelAction} />
                ) : null}
                {(modal === 'openTrack') ? (
                    <LoadTrackModal cancelAction={this.onCancelAction} okAction={this.onOpenFile} />
                ) : null}
                {(modal === 'waypoint') ? (
                    <WaypointModal cancelAction={this.onCancelAction} okAction={this.addWaypoint}
                        selectedLatitude={ui.selectedLatitude} selectedLongitude={ui.selectedLongitude} />
                ) : null}
                {(modal === 'removeFile') ? (
                    <RemoveFileModal
                        cancelAction={this.onCancelAction}
                        okAction={this.removeFile}
                    />
                ) : null}
                {(modal === 'removeFeature') ? (
                    <RemoveFeatureModal
                        cancelAction={this.onCancelAction}
                        okAction={this.removeFeature}
                    />
                ) : null}

                {(ui.menuType === 'main') ? (
                    <MainMenu
                        openFile={this.showOpenFileModal}
                        newFile={this.newFile}
                        locate={this.showLocateModal}
                        awaitingFunctionality={this.showAwaitingFunctionalityModal}
                        centreOnCurrentLocation={this.centreOnCurrentLocation}
                        drawLine={this.drawLine}
                        addWaypoint={this.waypointModal}
                        getMajorIncidents={this.getMajorIncidents}
                        showHelp={this.showHelpModal}
                        onEdit={this.onEdit}
                    />
                ) : (
                        <TrackMenu
                            // onStop={this.onStopLineEdit}
                            onStop={this.stopDrawLine} // NEED A WAY TO DETERMINE IF DRAWING A NEW LINE, OR EDITING AN EXISTING LINE
                            onCancel={this.onCancelDraw}
                            onHelp={this.showAwaitingFunctionalityModal}
                            trackElevation={this.showElevationPlot}
                            autoCorrectTrack={this.autoCorrectTrack}
                        />
                    )}

                <Collections
                    onSelectFile={this.onSelectFile}
                    onSelectFeature={this.onSelectFeature}
                    onRemoveFile={this.onRemoveFile}
                    onRemoveFeature={this.onRemoveFeature}
                />

                <div id="mapid"></div>
                <div>showElevation {ui.showElevation}</div>
                {ui.showElevation && selectedLine && <Elevation hideElevationPlot={this.hideElevationPlot} track={selectedLine} />}


            </div>)
    }
}

EditMap.propTypes = {
    dispatch: PropTypes.func,
    current: PropTypes.object,
    files: PropTypes.object,
    ui: PropTypes.object,
    tracks: PropTypes.array
}

function mapStateToProps(state) {
    return {
        current: state.current,
        ui: state.ui,
        tracks: state.tracks,
        files: state.files
    }
}

export default connect(mapStateToProps)(EditMap)
