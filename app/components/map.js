import React, { Component } from 'react'
import L, { Control, Marker, Map, GeoJSON, LayerGroup } from 'leaflet'
import { BasemapLayer, TiledMapLayer } from 'esri-leaflet'
import { toLatLng } from 'utm'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { cloneDeep } from 'lodash'
import moment from 'moment'
import { DragDropContext } from 'react-dnd'
import 'leaflet.pm'

import Api from '../utils/api'
import Collections from './collections/collections'
import MainMenu from './menu/main-menu'
import DrawingMenu from './menu/drawing-menu'
import Locate from './locate-modal'
import AwaitingFunctionality from './awaiting-functionality-modal'
import LoadTrackModal from './load-track-modal'
import WaypointModal from './waypoint-modal'
import RemoveFileModal from './collections/remove-file-modal'
import Elevation from '../components/stats/elevation'

import { selectTrack } from '../actions/tracks'
import { newFile,
    addFeatureToFile,
    updateFiles,
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
import { flameIcon, startIcon, markerIcon } from '../common/icons'
import { geojsonLineMarkerOptions } from '../common/marker-options'
import { getWaypointFeature, getGeoJsonLayer, getGeoJsonObject } from '../common/geojson'

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
let currentTrackLayerGroup
let collectionsLayerGroup  // features from all featureCollections
const layerGroups = []

const _getInitialLineGeojsonFeature = (latlng) => {
    console.log ('_getInitialLineFeature')
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
function onDrawLineClick(e) {
    const currentGeoJson = currentTrackLayerGroup.toGeoJSON ()

    // get all the Points
    const pointFeatures = currentGeoJson.features.filter (it => it.geometry.type === 'Point')

    // get the one and only line (do we want to restrict to 1 line?)
    let lineFeature = currentGeoJson.features.find (it => it.geometry.type === 'LineString')
    if (!lineFeature) lineFeature = _getInitialLineGeojsonFeature (e.latlng)

    pointFeatures.push (waypointFeature)

    //add waypointFeature coords to line
    lineFeature.geometry.coordinates.push ([e.latlng.lng, e.latlng.lat])

    // create temp waypoint
    const points = L.geoJSON (pointFeatures, {
        // each point will be converted to a marker with the defined options
        pointToLayer: function(feature) {
            const featureLatlng = [feature.geometry.coordinates[1], feature.geometry.coordinates[0]]
            if (feature.properties.type !== "user") {
                return L.circleMarker (featureLatlng, geojsonLineMarkerOptions);
            } else {
                return L.marker (featureLatlng, markerIcon)
            }
        }
    })
    const line = L.geoJSON (lineFeature, {
        style: function(feature) {
            return { color: feature.properties.color };
        },
        onEachFeature: function(feature, layer) {
            if (feature.properties && feature.properties.name) {
                layer.bindPopup (feature.properties.name);
            }
        }
    })

    // clear current track group layer before re-adding
    currentTrackLayerGroup.clearLayers ()

    // add to group
    currentTrackLayerGroup.addLayer (points)
    currentTrackLayerGroup.addLayer (line)
}

class EditMap extends Component {
    constructor(props) {
        super (props)
        // this.onLocationError = this.onLocationError.bind(this)
        // this.onLocationFound = this.onLocationFound.bind(this)
        this.onCancelAction = this.onCancelAction.bind (this)
        this.showAwaitingFunctionalityModal = this.showAwaitingFunctionalityModal.bind (this)
        this.showLocateModal = this.showLocateModal.bind (this)
        this.showOpenFileModal = this.showOpenFileModal.bind (this)
        this.onLocate = this.onLocate.bind (this)
        this.onOpenFile = this.onOpenFile.bind (this)
        this.centreOnCurrentLocation = this.centreOnCurrentLocation.bind (this)
        this.addWaypoint = this.addWaypoint.bind (this)
        this.addWaypointOnClick = this.addWaypointOnClick.bind (this)

        this.getMajorIncidents = this.getMajorIncidents.bind (this)
        this.autoCorrectTrack = this.autoCorrectTrack.bind (this)
        this.showElevationPlot = this.showElevationPlot.bind (this)
        this.hideElevationPlot = this.hideElevationPlot.bind (this)
        this.onSelectFile = this.onSelectFile.bind (this)
        this.onSelectFeature = this.onSelectFeature.bind (this)
        this.onEdit = this.onEdit.bind (this)
        this.onRemoveFile = this.onRemoveFile.bind (this)
        this.removeFile = this.removeFile.bind (this)
        this.onRemoveFeature = this.onRemoveFeature.bind (this)
        this.onCancelDraw = this.onCancelDraw.bind (this)
        this.onStopLineEdit = this.onStopLineEdit.bind (this)
        this.drawLine = this.drawLine.bind (this)
        this.stopDrawLine = this.stopDrawLine.bind (this)

        this.waypointModal = this.waypointModal.bind (this)

        this.state = {
            locate: false,
            // waypointModal: false,
            modal: null
        }
    }

    componentDidMount() {
        // console.log('map - utm>>', utm)
        console.log ('connect>>', connect)
        const { dispatch, current, ui, files } = this.props

        const baseLayer = new BasemapLayer ('Gray')

        // topo layer
        const topoLayer = new TiledMapLayer({
            // url: 'http://maps.six.nsw.gov.au/arcgis/rest/services/public/NSW_Topo_Map/MapServer',
            url: 'http://maps4.six.nsw.gov.au/arcgis/rest/services/sixmaps/LPIMap/MapServer',
            maxZoom: 17,
            maxNativeZoom: 15
        })

        // satellite image layer
        const imageLayer = new TiledMapLayer({
            // url: 'http://maps.six.nsw.gov.au/arcgis/rest/services/public/NSW_Imagery/MapServer'
            url: 'http://maps2.six.nsw.gov.au/arcgis/rest/services/sixmaps/LPI_Imagery_Best/MapServer'
        })

        const baseMaps = {
            "Base": baseLayer,
        }

        const center = current.center || [-33.668759325519204, 150.34924333915114]
        const zoom = current.zoom || 14
        map = new Map ('mapid', {
            center: center,
            zoom: zoom,
            maxZoom: 19,
            maxNativeZoom: 14,  // don't request tiles with a zoom > this (cos they don't exist)
            layers: [baseLayer, topoLayer],
            // layers: [baseLayer],
            editable: true
        })
        map.on ('moveend', function(e) {
            dispatch (saveMapDetails ({ center: map.getCenter (), zoom: map.getZoom () }))
        })
        map.zoomControl.setPosition ('bottomright')


        // define overlay layers for control
        overlayLayers = {
            "Topo": topoLayer,
            "Satellite": imageLayer
        }

        // add control button for layers
        layersControl = new Control.Layers(baseMaps, overlayLayers)
        layersControl.addTo(map)

        //add scale
        const scale = new Control.Scale ()
        scale.addTo (map)

        files.forEach (file => {
            console.log('PROCESSING FILE', file.name)
            const layerGroup = getGeoJsonLayer (file.name, file.featureCollection, dispatch, map, ui)

            layerGroups.push (layerGroup)
            layerGroup.addTo (map)
        })
    }

    // /*
    //  The source of truth is the redux state.
    //  If this changes, we may need to re-render.  However this is expensive, so only re-render when necessary.
    //  */
    // shouldComponentUpdate(nextProps, nextState) {
    //     // return a boolean value  - add test
    //     console.log ('shouldComponentUpdate')
    //     return true
    // }

    onCancelAction() {
        // console.log ('cancelAction')
        this.setState ({ modal: null })
    }

    /*
     convert form data to lat / long and move the map to that point (and turn off the modal)
     */
    onLocate(locateData) {
        const { latitude, longitude } = toLatLon (locateData.easting, locateData.northing, locateData.zone, undefined, false)
        map.panTo (new L.LatLng (latitude, longitude))
        this.setState ({ modal: null })
    }

    onRemoveFile(fileName) {
        // console.log ('remove', fileName)
        this.setState ({ modal: 'removeFile' })
    }

    /*
     I couldn't figure out how to clear a single geojson layer group so ended up re-populating from redux (minus the file)
     */
    removeFile(fileName) {
        console.log ('remove file props>', fileName, this.props)
        const { dispatch } = this.props
        dispatch (removeFileFromStore (fileName))  // update redux

        // layerGroups.forEach (layerGroup => {
        //     console.log ('layer', layerGroup.getLayers ())
        // })
        this.setState ({ modal: null })


        // const x = layerGroups.getLayers()
        // remove from map
        // files.forEach(file => {
        //
        // })

        //remove from redux
    }

    onRemoveFeature(e, featureName) {
        e.stopPropagation ();

        console.log ('remove feature', featureName)
    }

    onEdit() {
        console.log ('onEdit')
    }

    showLocateModal(e) {
        console.log ('showLocateModal', e)
        this.setState ({ modal: 'locate' })
    }

    showAwaitingFunctionalityModal() {
        this.setState ({ modal: 'awaitingFunctionality' })
    }

    /*
     show open track modal
     */
    showOpenFileModal() {
        console.log ('showOpenFile')
        this.setState ({ modal: 'openTrack' })
    }

    showElevationPlot() {
        console.log ('show elevation')
        this.props.dispatch (toggleElevation (true))
        // todo think I need to update
    }

    hideElevationPlot() {
        console.log ('show elevation')
        this.props.dispatch (toggleElevation (false))
    }

    /*
     save the FeatureCollection to redux
     That will trigger an update.
     */
    onOpenFile(fileText, fileName, colour) {
        const { dispatch, ui } = this.props

        const featureCollection = getGeoJsonObject (fileText, fileName)
        dispatch (newFile (featureCollection, fileName))

        // get the name from the lineString
        const line = featureCollection.features.find (it => it.geometry.type === 'LineString')
        // const featureCollectionName = line.properties.name

        // create new geojson layer for this featureCollection, and add to map
        const newFilesLayer = getGeoJsonLayer (fileName, featureCollection, dispatch, map, ui)
        newFilesLayer.addTo (map)

        // todo - set this to the selected featureCollection, and mark all other featureCollections as not selected.  This could be done in the

        // set bounds to fit this new layer
        map.fitBounds (newFilesLayer.getBounds ())

        // turn modal off
        this.setState ({ modal: null })
    }

    getMajorIncidents() {
        // todo - move to redux
        //https://stackoverflow.com/questions/43871637/no-access-control-allow-origin-header-is-present-on-the-requested-resource-whe
        // flames = https://assets-cdn.github.com/images/icons/emoji/unicode/1f525.png
        Api.getMajorIncidents ().then (data => {
            console.log ('MAJOR INCIDENTS - %J', data)
            // create waypoint
            const majorIncidents = L.geoJSON (data.data, {
                // each point will be converted to a marker with the defined options
                pointToLayer: function(feature, latlng) {
                    // return L.circleMarker(e.latlng, geojsonMarkerOptions);
                    return L.marker (latlng, { icon: flameIcon })
                    // L.marker([51.5, -0.09], {icon: greenIcon}).addTo(map);

                },
                // onEachFeature: function (feature, latlng) {
                //     console.log('open modal')
                //     // todo - allow a popup to be set to add content / change the marker
                // }
                onEachFeature: function(feature, layer) {
                    if (feature.properties && feature.properties.title) {
                        layer.bindPopup (feature.properties.title);
                    }
                }
            })

            // add track to overlay layers
            overlayLayers['Major Incidents'] = majorIncidents

            // add track layer to layer control
            layersControl.addOverlay (majorIncidents, 'Major Incidents')

            majorIncidents.addTo (map)
            // dispatch(contactFormSuccess());
        }).catch ((err) => {
            console.log ('ERROR', err)
            // dispatch(contactFormFailed(err.message));
        });
    }

    autoCorrectTrack() {
        const { tracks } = this.props
        // find the selected track
        const selectedTrack = getSelectedTrack (tracks)
        // console.log('selectedTrack', selectedTrack)
        const line = getLine (selectedTrack)
        // console.log('line', line)
        const coordinates = cloneDeep (line.geometry.coordinates)
        const coordTimes = cloneDeep (line.properties.coordTimes)

        // console.log('coordinates', coordinates)
        console.log ('coordTimes', coordTimes)
        const distances = []
        const limit = coordinates.length - 1
        for (let i = 0; i < limit; i++) {
            distances.push (getDistanceBetween2Points (coordinates[i], coordinates[i + 1]))
        }
        console.log ('distances', distances)

        const times = []
        for (let i = 0; i < limit; i++) {
            times.push (getMillisecsBetween2Points (coordTimes[i], coordTimes[i + 1]))
        }

        const speeds = []
        console.log ('times', times)
        const numberOfElements = distances.length - 1
        for (let i = 0; i < numberOfElements; i++) {
            // time in ms, distance m, convert to km / hour
            speeds.push (distances[i] * 3600 / times[i])
        }
        console.log ('speeds', speeds)

        const maxSpeed = 3 // want to make variable
        const minSpeed = 2
        const updatedSpeeds = []
        for (let i = 0; i < numberOfElements; i++) {

            // remove coordinates and times where there was no movement.
            if (speeds[i] < minSpeed || speeds[i] > 10) {
                distances.splice (i, 1)
                times.splice (i, 1)
                coordinates.splice (i + 1, 1)
                coordTimes.splice (i + 1, 1)
            } else {
                updatedSpeeds.push (speeds[i])
            }
        }

        console.log ('new speeds', updatedSpeeds)
        console.log ('new distances', distances)
        console.log ('new times', times)

        // now build a new track
        const newLine = cloneDeep (line)
        newLine.geometry.coordinates = coordinates
        newLine.properties.coordTimes = coordTimes

        // todo - copy over other features
        let newtracksLayer
        // create new geojson layer for this track
        newtracksLayer = new GeoJSON ([newLine], {
            style: function(feature) {
                return {
                    // color: line.properties.color || 'red',
                    color: 'green',
                    weight: 3,
                };
            },
            onEachFeature: function(feature, layer) {
                layer.on ('mouseover', function() {
                    this.setStyle ({
                        weight: 5
                    })
                })
                layer.on ('mouseout', function() {
                    newtracksLayer.resetStyle (this)
                })
                layer.on ('click', function() {
                    console.log ('select3')
                    layer.off (mouseout, mouseout ())
                    dispatch (selectTrack (newtracksLayer))
                    this.setStyle ({
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
        layersControl.addOverlay (newtracksLayer, trackName)


        console.log ('autocorrect the current track')
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
        map.locate ({ setView: true })
        map.on ('locationerror', onLocationError)
        map.on ('locationfound', onLocationFound)

        function onLocationError(e) {
            alert (e.message)
        }

        function onLocationFound(e) {
            // console.log('onLocation found', e)
            var radius = e.accuracy / 2
            // console.log(`you are within ${radius} meters from this point`)


            L.circle (e.latlng, {
                color: '#3ad',
                fillColor: '#30f',
                fillOpacity: 0.5,
                radius
            }).addTo (map).bindPopup ("You are located within this circle").openPopup ()
        }
    }

    /*
     remove crosshairs cursor and click functionality
     */
    stopDrawLine() {
        L.DomUtil.removeClass (map._container, 'leaflet-crosshair')
        map.off ('click', onDrawLineClick)
    }

    /*
     Stop drawing the line without saving any changes
     This means removing the drawing menu and not showing the editable waypoints of the track.
     */
    onCancelDraw() {
        // need to know which line we are dealing with, so this has be be saved on clicking the track to start drawing
        this.props.dispatch (showMainMenu ())
        this.props.dispatch (unselectLine ())
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
        console.log ('drawLine')
        L.DomUtil.addClass (map._container, 'leaflet-crosshair')
        map.on ('click', onDrawLineClick)
        dispatch (showDrawingMenu ())
    }

    /*
     GeoJson extends FeatureGroup, which extends LayerGroup, so
     we can add extra GeoJson Layers to the layer group

     open the modal for adding / modifying details of the waypoint
     */
    waypointModal() {
        // change cursor to crosshairs
        L.DomUtil.addClass (map._container, 'leaflet-crosshair')

        map.on ('click', this.addWaypointOnClick)
    }

    /*
     waypoint has been selected.  Store its details in state, update the cursor, and remove the listener
     */
    addWaypointOnClick(e) {
        const { dispatch } = this.props

        // save latlng
        dispatch (selectLatLng (e.latlng.lat, e.latlng.lng))

        //open waypont modal
        this.setState ({ modal: 'waypoint' })

        // turn off waypoint select
        L.DomUtil.removeClass (map._container, 'leaflet-crosshair')

        map.off ('click', this.addWaypointOnClick)
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

        const waypointFeature = getWaypointFeature (featureData.pointName, ui.selectedLatitude, ui.selectedLongitude)

        if (!ui.selectedFileName) {
            // else {
            // add to selected collection
            this.setState ({ modal: null })

            // update the map
            // get all the features from all collections and add them as 1 single layer
            // - this is so we can simply remove the lot before re-adding.
            let features = []
            files.forEach (it => {
                features = features.concat (it.featureCollection.features)
            })

            features.push (waypointFeature)  // add the new feature
            const featureCollection = {
                features  // don't think I need to put in the type
            }

            // todo - here we are using redux as the source of truth. change?
            // todo - do we want to have a different layer group for each file
            // clicking on a collection could then centre on it.
            //update the map - removes everything, and re-adds
            map.removeLayer (collectionsLayerGroup)
            // //todo update the collection here rather than the
            collectionsLayerGroup = getGeoJsonLayer (ui.selectedFileName, featureCollection, dispatch, map, ui)
            collectionsLayerGroup.addTo (map)

            dispatch (addFeatureToFile (waypointFeature, ui.selectedFileName))
            dispatch (clearLatLng ())  // clear the selected lat lng whatever that is
            // }
        } else {
            // need to select collection
            if (files.length === 0) {
                // add new file - but then want to return here - how to do this?
                // todo - create new file and add waypoint
                const fileName = moment ().format ('YYYY-MM-DD hh:mm:ss')
                const featureCollection = {
                    features: [waypointFeature]
                }
                dispatch (newFile (featureCollection, fileName))
            }
        }
    }

    /*

     */
    onSelectFile(fileName) {
        console.log ('onSelectFile', fileName)
        this.props.dispatch (selectFile (fileName))
    }

    onSelectFeature(id) {
        console.log ('onSelectFeature')
        // this.props.dispatch(selectFile(collectionName))

    }

    onStopLineEdit() {
        console.log ('onStopLineEdit')
        const { ui, dispatch, files } = this.props

        if (ui.selectedLineId){

            // there is a layer group for each geojson file.  Inside that there is a layer for every feature
            layerGroups.forEach(layerGroup => {

                const layers = layerGroup.getLayers ()
                layers.forEach(layer => {
                    if (layer.id) { // layer id is what I added
                        layer.pm.disable() // disable editing
                        layerGroup.resetStyle(layer) // reset style back to the original
                        dispatch(unselectLine()) // update redux as this line is no longer selected for editing
                        dispatch(showMainMenu())

                        // update the geojson stored in redux.
                        const geoJson = layer.toGeoJSON()
                        files.forEach(file => {
                            const featureIndex = file.featureCollection.features.findIndex(feature => feature.properties.id === layer.id)
                            file.featureCollection.features.splice(featureIndex, 1)
                            file.featureCollection.features.push(geoJson)

                            dispatch(updateFile(file.name))
                        })
                    }
                })
            })
        }
    }

    render() {
        // todo - display all the tracks stored in redux state, and set the bounds to the selected Track

        const { ui, currentLayer, files, dispatch } = this.props
        return (
            <div id="mapwrap">
                {(this.state.modal === 'locate') ? (
                    <Locate cancelAction={this.onCancelAction} okAction={this.onLocate}/>
                ) : null}
                {(this.state.modal === 'awaitingFunctionality') ? (
                    <AwaitingFunctionality cancelAction={this.onCancelAction}/>
                ) : null}
                {(this.state.modal === 'openTrack') ? (
                    <LoadTrackModal cancelAction={this.onCancelAction} okAction={this.onOpenFile}/>
                ) : null}
                {(this.state.modal === 'waypoint') ? (
                    <WaypointModal cancelAction={this.onCancelAction} okAction={this.addWaypoint}
                                   selectedLatitude={ui.selectedLatitude} selectedLongitude={ui.selectedLongitude}/>
                ) : null}
                {(this.state.modal === 'removeFile') ? (
                    <RemoveFileModal
                        cancelAction={this.onCancelAction}
                        okAction={this.removeFile}
                    />
                ) : null}

                {(ui.menuType === 'main') ? (
                    <MainMenu
                        openFile={this.showOpenFileModal}
                        locate={this.showLocateModal}
                        awaitingFunctionality={this.showAwaitingFunctionalityModal}
                        centreOnCurrentLocation={this.centreOnCurrentLocation}
                        drawLine={this.drawLine}
                        stopDrawLine={this.stopDrawLine}
                        addWaypoint={this.waypointModal}
                        getMajorIncidents={this.getMajorIncidents}
                        autoCorrectTrack={this.autoCorrectTrack}
                        showElevationPlot={this.showElevationPlot}
                        onEdit={this.onEdit}
                    />
                ) : (
                    <DrawingMenu
                        onStop={this.onStopLineEdit}
                        onCancel={this.onCancelDraw}
                        onHelp={this.showAwaitingFunctionalityModal}
                    />
                )}


                <Collections
                    onSelectFile={this.onSelectFile}
                    onSelectFeature={this.onSelectFeature}
                    onRemoveFile={this.onRemoveFile}
                    onRemoveFeature={this.onSelectFeature}
                />

                <div id="mapid"></div>
                <div>showElevation { ui.showElevation }</div>
                { ui.showElevation ? (<Elevation hideElevationPlot={this.hideElevationPlot}/>) : null }
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

export default connect (mapStateToProps) (EditMap)
// export default connect(mapStateToProps)(DragDropContext(HTML5Backend)(EditMap))  // this should work, altho I put the DragDropContext in the 'main' eleement


