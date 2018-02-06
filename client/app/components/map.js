import React, {Component} from 'react'
import L, {Control, Marker, Map, GeoJSON} from 'leaflet'
import {BasemapLayer, TiledMapLayer} from 'esri-leaflet'
import utm from 'utm'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Api from '../utils/api'

import Search from './search'
import Location from './location'
import Toolbar from './toolbar'
import Locate from './locate-modal'
import AwaitingFunctionality from './awaiting-functionality-modal'
import LoadTrackModal from './load-track-modal'
import Elevation from '../components/stats/elevation'

import { saveTrack, selectTrack } from '../actions/tracks'
import { toggleElevation } from '../actions/ui'

import Icon from './icon'
// import _ from 'lodash'

var geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
}

//https://gis.stackexchange.com/questions/240738/control-custom-panes-for-leaflet-geojson-svg-icons

/*
 custom icon stuff
 */
//https://gist.github.com/clhenrick/6791bb9040a174cd93573f85028e97af
var CustomIcon = L.Icon.extend({
    options: {
        iconSize: [40, 40],
        shadowSize: [50, 64],
        iconAnchor: [22, 94],
        shadowAnchor: [4, 62],
        popupAnchor: [-3, -76]
    }
})

var myIcon = L.icon({
    iconUrl: 'assets/svg/start.svg',
    // iconUrl: 'assets/svg/rect.svg',
    iconSize: [32, 32],
    iconAnchor: [0, 16],
    popupAnchor: [0, -28]
})

// todo - reinstate something similar - this has got functionality for processing points

// THIS COULD BE NEW TRACK LAYER?
// const tracksLayer = new GeoJSON(null, {
//     pointToLayer: function (feature, latlng) {
//         console.log('feature', feature.properties.sym)
//         console.log('indexof', feature.properties.sym.indexOf('Flag'))
//         if (feature.properties.sym.indexOf('Flag') !== -1) console.log('flag')
//         return L.marker(latlng, {icon: myIcon, pane: 'markerPane'})
//     }
// })




// marker definition options
const geojsonLineMarkerOptions = {
    radius: 5,
    fillColor: "#FFF",
    color: "#F00",
    weight: 2,
    opacity: 1,
    fillOpacity: 0.5
};

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
let currentTrack
let currentTrackLayerGroup

const _getInitialLineFeature = (latlng) => {
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


// create function for map click after addWaypoint selected
function addWaypointOnClick(e) {
    // set up waypoint geojson
    const waypointFeature = {
        "type": "Feature",
        "properties": {
            "name": "CC THUNDER JT",
            "time": "2014-04-12T01:40:46Z",
            "sym": "Flag, Blue",
            "type": "user"
        },
        "geometry": {
            "type": "Point",
            "coordinates": [
                e.latlng.lat,
                e.latlng.lng,
                null
            ]
        }
    }

    // create waypoint
    const waypoint = L.geoJSON(waypointFeature, {
        // each point will be converted to a marker with the defined options
        pointToLayer: function (feature, latlng) {
            // return L.circleMarker(e.latlng, geojsonMarkerOptions);
            console.log('initial waypoint', e.latlng)
            return L.marker(e.latlng)
        },
        // onEachFeature: function (feature, latlng) {
        //     console.log('open modal')
        //     // todo - allow a popup to be set to add content / change the marker
        // }
        onEachFeature: function (feature, layer) {
            if (feature.properties && feature.properties.name) {
                layer.bindPopup(feature.properties.name);
            }
        }
    })

    // add to group
    currentTrackLayerGroup.addLayer(waypoint)

    L.DomUtil.removeClass(map._container, 'leaflet-crosshair')
    map.off('click', addWaypointOnClick)
}

function onDrawLineClick(e) {
    const currentGeoJson = currentTrackLayerGroup.toGeoJSON()

    const pointFeatures = currentGeoJson.features.filter(it => it.geometry.type === 'Point')
    console.log('pointFeatures', pointFeatures)

    let lineFeature = currentGeoJson.features.find(it => it.geometry.type === 'LineString')
    if (!lineFeature) lineFeature = _getInitialLineFeature(e.latlng)

    // set up waypoint geojson
    const waypointFeature = {
        "type": "Feature",
        "properties": {
            "name": "",
            "time": ""
        },
        "geometry": {
            "type": "Point",
            "coordinates": [
                e.latlng.lng,
                e.latlng.lat,
                null
            ]
        }
    }

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
                return L.marker(featureLatlng)
            }
        }
    })
    const line = L.geoJSON(lineFeature, {
        style: function (feature) {
            return {color: feature.properties.color};
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

class MyMap extends Component {
    constructor(props) {
        super(props)
        // this.onLocationError = this.onLocationError.bind(this)
        // this.onLocationFound = this.onLocationFound.bind(this)
        this.onCancelAction = this.onCancelAction.bind(this)
        this.showAwaitingFunctionalityModal = this.showAwaitingFunctionalityModal.bind(this)
        this.showLocateModal = this.showLocateModal.bind(this)
        this.showOpenTrackModal = this.showOpenTrackModal.bind(this)
        this.onLocate = this.onLocate.bind(this)
        this.onOpenTrack = this.onOpenTrack.bind(this)
        this.centreOnCurrentLocation = this.centreOnCurrentLocation.bind(this)
        this.addWaypoint = this.addWaypoint.bind(this)
        this.selectATrack = this.selectATrack.bind(this)
        this.drawLine = this.drawLine.bind(this)
        this.stopDrawLine = this.stopDrawLine.bind(this)
        this.getMajorIncidents = this.getMajorIncidents.bind(this)
        this.autoCorrectTrack = this.autoCorrectTrack.bind(this)
        this.showElevationPlot = this.showElevationPlot.bind(this)
        this.hideElevationPlot = this.hideElevationPlot.bind(this)

        this.state = {
            locate: false,
            modal: null
        }
    }

    componentDidMount() {

        const baseLayer = new BasemapLayer('Gray')

        // topo layer
        const topoLayer = new TiledMapLayer({
            url: 'http://maps.six.nsw.gov.au/arcgis/rest/services/public/NSW_Topo_Map/MapServer'
        })

        // satellite image layer
        const imageLayer = new TiledMapLayer({
            url: 'http://maps.six.nsw.gov.au/arcgis/rest/services/public/NSW_Imagery/MapServer'
        })

        const baseMaps = {
            "Base": baseLayer,
        }


        map = new Map('mapid', {
            center: [-33.668759325519204, 150.34924333915114],
            zoom: 15,
            maxZoom: 16,  // todo - maybe the zoom thing is caused by the esri thing
            // maxZoom: 21,
            // maxNativeZoom: 16,
            layers: [baseLayer, topoLayer]
            // layers: [baseLayer]

        })
        map.zoomControl.setPosition('bottomright')


        // define overlay layers for control
        overlayLayers = {
            "Topo": topoLayer,
            "Satellite": imageLayer
        }

        // add control button for layers
        layersControl = new Control.Layers(baseMaps, overlayLayers)
        layersControl.addTo(map)

        //add scale
        const scale = new Control.Scale()
        scale.addTo(map)

        //add track layer to map
        currentTrackLayerGroup = new GeoJSON([initialTrack], {
            style: function (feature) {
                return {color: line.properties.color || 'red'};
            }
        })
        currentTrackLayerGroup.addTo(map)
    }

    onCancelAction() {
        console.log('cancelAction')
        this.setState({modal: null})
    }

    /*
     convert form data to lat / long and move the map to that point (and turn off the modal)
     */
    onLocate(locateData) {
        const {latitude, longitude} = utm.toLatLon(locateData.easting, locateData.northing, locateData.zone, undefined, false)
        map.panTo(new L.LatLng(latitude, longitude))
        this.setState({modal: null})
    }

    showLocateModal(e) {
        console.log('showLocateModal', e)
        this.setState({modal: 'locate'})
    }

    showAwaitingFunctionalityModal() {
        this.setState({modal: 'awaitingFunctionality'})
    }

    /*
     show open track modal
     */
    showOpenTrackModal() {
        console.log('showOpenTrack')
        this.setState({modal: 'openTrack'})
    }

    showElevationPlot() {
        console.log('show elevation')
        this.props.dispatch(toggleElevation(true))
        // todo think I need to update
    }
    hideElevationPlot() {
        console.log('show elevation')
        this.props.dispatch(toggleElevation(false))
    }

    // todo -change newTracksLayer -> newTrackLayer
    onOpenTrack(fileText, colour) {
        const { dispatch } = this.props

        //parse track
        const track = JSON.parse(fileText)  //.features[0].geometry
        const line = track.features.find(it => it.geometry.type === 'LineString')
        const trackName = line.properties.name

        let newtracksLayer
        // create new geojson layer for this track
        newtracksLayer = new GeoJSON([track], {
            style: function (feature) {
                return {
                    color: line.properties.color || 'red',
                    weight: 3,
                };
            },
            onEachFeature: function (feature, layer) {
                layer.on('mouseover', function() {
                    this.setStyle({
                        weight: 5
                    })
                })
                layer.on('mouseout', function () {
                    newtracksLayer.resetStyle(this)
                })
                layer.on('click', function() {
                    console.log('select')
                    dispatch(selectTrack(track))
                    this.setStyle({
                        weight: 5,
                        dashArray: '5, 10, 7, 10, 10, 10'
                    })
                })
            }
        })

        // add to map
        newtracksLayer.addTo(map)
        this.props.dispatch(saveTrack(track))

        // todo - set this to the selected track, and mark all other tracks as not selected.  This could be done in the
        // saveTrack() method

        // add track to overlay layers
        overlayLayers[trackName] = newtracksLayer

        // add track layer to layer control
        layersControl.addOverlay(newtracksLayer, trackName)

        // set bounds to fit this new layer
        map.fitBounds(newtracksLayer.getBounds())

        // turn modal off
        this.setState({modal: null})
    }

    getMajorIncidents() {
        // flames = https://assets-cdn.github.com/images/icons/emoji/unicode/1f525.png
        Api.getMajorIncidents().then(data => {
            console.log('MAJOR INCIDENTS - %J', data)
            // create waypoint
            const majorIncidents = L.geoJSON(data, {
                // each point will be converted to a marker with the defined options
                pointToLayer: function (feature, latlng) {
                    // return L.circleMarker(e.latlng, geojsonMarkerOptions);
                    console.log('initial waypoint', e.latlng)
                    return L.marker(e.latlng)
                },
                onEachFeature: function (feature, latlng) {
                    console.log('open modal')
                    // todo - allow a popup to be set to add content / change the marker
                }
            })

            // add track to overlay layers
            overlayLayers['Major Incidents'] = majorIncidents

            // add track layer to layer control
            layersControl.addOverlay(majorIncidents, 'Major Incidents')

            majorIncidents.addTo(map)
            // dispatch(contactFormSuccess());
        }).catch((err) => {
            console.log('ERROR', err)
            // dispatch(contactFormFailed(err.message));
        });
    }

    autoCorrectTrack() {
        console.log('autocorrect the current track')
        const currentGeoJson = currentTrackLayerGroup.toGeoJSON()

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
        map.locate({setView: true})
        map.on('locationerror', onLocationError)
        map.on('locationfound', onLocationFound)

        function onLocationError(e) {
            alert(e.message)
        }

        function onLocationFound(e) {
            console.log('onLocation found', e)
            // var radius = e.accuracy / 2
            // console.log(`you are within ${radius} meters from this point`)

            // L.circle(e.latlng, radius).addTo(map).bindPopup("You are located within this circle").openPopup()
        }
    }

    /*
    remove crosshairs cursor and click functionality
     */
    stopDrawLine() {
        L.DomUtil.removeClass(map._container,'leaflet-crosshair')
        map.off('click', onDrawLineClick)
    }

    /*
    change cursor and add click functionality
     */
    drawLine() {
        L.DomUtil.addClass(map._container, 'leaflet-crosshair')
        map.on('click', onDrawLineClick)
    }

    /*
     GeoJson extends FeatureGroup, which extends LayerGroup, so
     we can add extra GeoJson Layers to the layer group
     */
    addWaypoint() {
        // change cursor to crosshairs
        L.DomUtil.addClass(map._container, 'leaflet-crosshair')

        // marker definition options
        var geojsonMarkerOptions = {
            radius: 8,
            fillColor: "#ff7800",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };

        map.on('click', addWaypointOnClick)
    }

    selectATrack() {
        // change cursor to crosshairs
        L.DomUtil.addClass(map._container, 'leaflet-crosshair')

        // create function for map click after selectATrack has been selected
        function onSelectTrack(e) {
            // find nearest track
            console.log('find nearest track')


            // set current track layer


            // marker.setLatLng(e.latlng).addTo(tracksLayer)

            // reset cursor
            L.DomUtil.removeClass(map._container, 'leaflet-crosshair')
            map.off('click', onSelectTrack)
        }

        map.on('click', onSelectTrack)
    }

    render() {
        // todo - display all the tracks stored in redux state, and set the bounds to the selected Track


        // todo - I think the toolbar should be another level up eg within main
        console.log('modal', this.state.modal)
        const { ui, currentLayer, dispatch } = this.props
        return (
            <div id="mapwrap">
                {(this.state.modal === 'locate') ? (
                    <Locate cancelAction={this.onCancelAction} okAction={this.onLocate}/>
                ) : null}
                {(this.state.modal === 'awaitingFunctionality') ? (
                    <AwaitingFunctionality cancelAction={this.onCancelAction}/>
                ) : null}
                {(this.state.modal === 'openTrack') ? (
                    <LoadTrackModal cancelAction={this.onCancelAction} okAction={this.onOpenTrack}/>
                ) : null}

                <Toolbar
                    locate={this.showLocateModal}
                    awaitingFunctionality={this.showAwaitingFunctionalityModal}
                    openTrack={this.showOpenTrackModal}
                    centreOnCurrentLocation={this.centreOnCurrentLocation}
                    drawLine={this.drawLine}
                    stopDrawLine={this.stopDrawLine}
                    addWaypoint={this.addWaypoint}
                    selectATrack={this.selectATrack}
                    getMajorIncidents={this.getMajorIncidents}
                    autoCorrectTrack={this.autoCorrectTrack}
                    showElevationPlot={this.showElevationPlot}

                />
                <div id="mapid"></div>
                <div>showElevation { ui.showElevation }</div>
                { ui.showElevation ? (<Elevation hideElevationPlot={this.hideElevationPlot} />) : null }


            </div>)
    }
}

MyMap.propTypes = {
    dispatch: PropTypes.func,
    currentLayer: PropTypes.object,
    ui: PropTypes.object
}

function mapStateToProps(state) {
    return {
        currentLayer: state.currentLayer,
        ui: state.ui
    }
}

export default connect(mapStateToProps)(MyMap)

