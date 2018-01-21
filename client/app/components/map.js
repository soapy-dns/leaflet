import React, {Component} from 'react'
import L, {Control, Marker, Map, GeoJSON} from 'leaflet'
import {BasemapLayer, TiledMapLayer} from 'esri-leaflet'
var utm = require('utm')

import Search from './search'
import Location from './location'
import Toolbar from './toolbar'
import Locate from './locate-modal'
import AwaitingFunctionality from './awaiting-functionality-modal'
import LoadTrackModal from './load-track-modal'
import Icon from './icon'

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
        iconSize:     [40, 40],
        shadowSize:   [50, 64],
        iconAnchor:   [22, 94],
        shadowAnchor: [4, 62],
        popupAnchor:  [-3, -76]
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

let initialTrack = {
    type: "FeatureCollection",
    features: [
        {
            "type": "Feature",
            "properties": {
                "name": "current",
                "time": "",
                "color": "blue"
            }
        }
    ]
}

let map
let overlayLayers
let layersControl
let currentTrack
let currentTrackLayerGroup

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

        // const myTrack = track.features[0].geometry
        // const tracksLayer = new GeoJSON([myTrack])

        const baseMaps = {
            "Base": baseLayer,
        }
        overlayLayers = {
            "Topo": topoLayer,
            "Image": imageLayer,
            // "Tracks": tracksLayer
        }

        map = new Map('mapid', {
            // center: [-33.75999, -209.59236],
            center: [-33.668759325519204, 150.34924333915114],
            zoom: 15,
            maxZoom: 16,
            layers: [baseLayer, topoLayer]
            // layers: [baseLayer]

        })
        map.zoomControl.setPosition('bottomright')

        // add control button for layers
        layersControl = new Control.Layers(baseMaps, overlayLayers)
        layersControl.addTo(map)

        //add scale
        const scale = new Control.Scale()
        scale.addTo(map)

        //add track layer to map
        currentTrackLayerGroup = new GeoJSON([initialTrack], {style: function (feature) {
            return {color: line.properties.color || 'red'};
        }})
        currentTrackLayerGroup.addTo(map)
    }

    onCancelAction() {
        console.log('cancelAction')
        this.setState({ modal: null })
    }

    /*
    convert form data to lat / long and move the map to that point (and turn off the modal)
     */
    onLocate(locateData) {
        const { latitude, longitude } = utm.toLatLon(locateData.easting, locateData.northing, locateData.zone, undefined, false )
        map.panTo(new L.LatLng(latitude, longitude))
        this.setState({ modal: null })
    }

    showLocateModal(e) {
        console.log('showLocateModal', e)
        this.setState({ modal: 'locate' })
    }

    showAwaitingFunctionalityModal() {
        this.setState({ modal: 'awaitingFunctionality'})
    }

    /*
    show open track modal
     */
    showOpenTrackModal() {
        console.log('showOpenTrack')
        this.setState({ modal: 'openTrack'})
    }

    onOpenTrack(fileText, colour) {

        //parse track
        const track = JSON.parse(fileText)  //.features[0].geometry
        const line = track.features.find(it => it.geometry.type === 'LineString')
        const trackName = line.properties.name

        // get array of all the fixtures, and add to the layer group

        // create new geojson layer for this track
        const newtracksLayer = new GeoJSON([track], {style: function (feature) {
            return {color: line.properties.color || 'red'};
        }})

        // add to map
        newtracksLayer.addTo(map)

        // add track to overlay layers
        overlayLayers[trackName] = newtracksLayer

        // add track layer to layer control
        layersControl.addOverlay(newtracksLayer, trackName)

        // set bounds to fit this new layer
        map.fitBounds(newtracksLayer.getBounds())

        // turn modal off
        this.setState({ modal: null })
    }

    centreOnCurrentLocation() {
        map.locate({ setView: true })
        map.on('locationerror', onLocationError)
        map.on('locationfound', onLocationFound)

        function onLocationError(e) {
            alert(e.message)
        }

        function onLocationFound(e)  {
            console.log('onLocation found', e)
            // var radius = e.accuracy / 2
            // console.log(`you are within ${radius} meters from this point`)

            // L.circle(e.latlng, radius).addTo(map).bindPopup("You are located within this circle").openPopup()
        }
    }

    drawLine() {
        console.log('draw line')
        // change cursor to crosshairs
        L.DomUtil.addClass(map._container,'leaflet-crosshair')
        // const currentFeatures = currentTrackLayerGroup.toGeoJSON()

        // marker definition options
        var geojsonMarkerOptions = {
            radius: 5,
            fillColor: "#FFF",
            color: "#F00",
            weight: 2,
            opacity: 1,
            fillOpacity: 0.5
        };
        function onMapClick(e) {
            const currentFeatures = currentTrackLayerGroup.toGeoJSON()
            const features = Object.assign({}, currentFeatures)

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
            console.log('add new point', e.latlng.lat, e.latlng.lng)

            features.features.push(waypointFeature)
            // console.log('new fetures', features)
            // console.log('len', currentTrackLayerGroup.getLayers().length)
            currentTrackLayerGroup.clearLayers()
            console.log('new features', features)
            // console.log('len2', currentTrackLayerGroup.getLayers().length)


            // create temp waypoint
            const track = L.geoJSON(features, {
                // each point will be converted to a marker with the defined options
                pointToLayer: function (feature, latlng) {
                    // console.log('lat', e.latlng.lat)
                    // console.log('lat in feature', feature.geometry.coordinates[0], feature.geometry.coordinates[1])
                    // console.log('geometry', feature.geometry)
                    console.log('add marker!! lat long', feature.geometry.coordinates[1], feature.geometry.coordinates[0])
                    return L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], geojsonMarkerOptions);
                }
            })

            // add to group
            currentTrackLayerGroup.addLayer(track)

            // const layers = currentTrackLayerGroup.getLayers();

            // console.log('currentLayer2', currentTrackLayerGroup.toGeoJSON())


            // L.DomUtil.removeClass(map._container,'leaflet-crosshair')
            // map.off('click', onMapClick)

        }
        map.on('click', onMapClick)
    }
/*
GeoJson extends FeatureGroup, which extends LayerGroup, so
we can add extra GeoJson Layers to the layer group
 */
    addWaypoint() {
        // change cursor to crosshairs
        L.DomUtil.addClass(map._container,'leaflet-crosshair')

        // marker definition options
        var geojsonMarkerOptions = {
            radius: 8,
            fillColor: "#ff7800",
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };

        //https://stackoverflow.com/questions/34501524/in-place-update-leaflet-geojson-feature

        // create function for map click after addWaypoint selected
        function onMapClick(e) {
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
                    return L.marker(e.latlng);
                },
                onEachFeature: function(feature, latlng) {
                        console.log('open modal')
                        // todo - allow a popup to be set to add content / change the marker
                }
            })

            // add to group
            currentTrackLayerGroup.addLayer(waypoint)

            console.log('currentLayer', currentTrackLayerGroup.toGeoJSON())


            L.DomUtil.removeClass(map._container,'leaflet-crosshair')
            map.off('click', onMapClick)

        }
        map.on('click', onMapClick)
    }

    selectATrack() {
        // change cursor to crosshairs
        L.DomUtil.addClass(map._container,'leaflet-crosshair')

        // create function for map click after selectATrack has been selected
        function onSelectTrack(e) {
            // find nearest track
            console.log('find nearest track')


            // set current track layer


            // marker.setLatLng(e.latlng).addTo(tracksLayer)

            // reset cursor
            L.DomUtil.removeClass(map._container,'leaflet-crosshair')
            map.off('click', onSelectTrack)
        }
        map.on('click', onSelectTrack)
    }

    render() {
        // todo - I think the toolbar should be another level up eg within main
        console.log('modal', this.state.modal)
        return (
            <div id="mapwrap">
                {(this.state.modal === 'locate') ? (
                    <Locate cancelAction={this.onCancelAction} okAction={this.onLocate} />
                ) : null}
                {(this.state.modal === 'awaitingFunctionality') ? (
                    <AwaitingFunctionality cancelAction={this.onCancelAction} />
                ) : null}
                {(this.state.modal === 'openTrack') ? (
                    <LoadTrackModal cancelAction={this.onCancelAction} okAction={this.onOpenTrack} />
                ) : null}

                <Toolbar
                    locate={this.showLocateModal}
                    awaitingFunctionality={this.showAwaitingFunctionalityModal}
                    openTrack={this.showOpenTrackModal}
                    centreOnCurrentLocation={this.centreOnCurrentLocation}
                    drawLine={this.drawLine}
                    addWaypoint={this.addWaypoint}
                    selectATrack={this.selectATrack}

                />
                <div id="mapid"></div>


            </div>)
    }
}

export default MyMap

