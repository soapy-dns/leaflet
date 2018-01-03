import React, {Component} from 'react'
import L, {Control, Marker, Map, GeoJSON} from 'leaflet'
import {BasemapLayer, TiledMapLayer} from 'esri-leaflet'
// const utmObj = require('utm-latlng');
// const utm = new utmObj(); //Default Ellipsoid is 'WGS 84'
var utm = require('utm')

import Search from './search'
import Location from './location'
import track from '../data/arethusa'
import Toolbar from './toolbar'
import Locate from './locate-modal'
import AwaitingFunctionality from './awaiting-functionality-modal'
import LoadTrackModal from './load-track-modal'

const tracksLayer = new GeoJSON()
let map

class MyMap extends Component {
    constructor(props) {
        super(props);
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

        this.state = {
            locate: false,
            modal: null
        };
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
        const overlayMaps = {
            "Topo": topoLayer,
            "Image": imageLayer,
            "Tracks": tracksLayer
        }

        map = new Map('mapid', {
            // center: [-33.75999, -209.59236],
            center: [-33.668759325519204, 150.34924333915114],
            zoom: 14,
            maxZoom: 16,
            layers: [baseLayer, topoLayer]
        })
        map.zoomControl.setPosition('bottomright');

        // add control button for layers
        const layersControl = new Control.Layers(baseMaps, overlayMaps)
        layersControl.addTo(map)

        //add scale
        const scale = new Control.Scale()
        scale.addTo(map)

        //add track layer to map
        tracksLayer.addTo(map)
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
        map.panTo(new L.LatLng(latitude, longitude));
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

    onOpenTrack(fileText) {
        const myTrack = JSON.parse(fileText).features[0].geometry
        tracksLayer.addData(myTrack)

        // set bounds
        map.fitBounds(tracksLayer.getBounds());

        // todo ensure track layer is turned on


        // turn modal off
        this.setState({ modal: null })
    }

    centreOnCurrentLocation() {
        map.locate({ setView: true })
        map.on('locationerror', onLocationError)
        map.on('locationfound', onLocationFound);

        function onLocationError(e) {
            alert(e.message)
        }

        function onLocationFound(e)  {
            console.log('onLocation found', e)
            // var radius = e.accuracy / 2;
            // console.log(`you are within ${radius} meters from this point`)

            // L.circle(e.latlng, radius).addTo(map).bindPopup("You are located within this circle").openPopup()
        }
    }

    addWaypoint() {
        // change cursor to crosshairs
        L.DomUtil.addClass(map._container,'leaflet-crosshair');

        const marker = L.marker()

        // create function for map click after addWaypoint selected
        function onMapClick(e) {
            marker.setLatLng(e.latlng).addTo(tracksLayer)
            L.DomUtil.removeClass(map._container,'leaflet-crosshair');
        }
        map.on('click', onMapClick);
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
                    addWaypoint={this.addWaypoint}
                />
                <div id="mapid"></div>


            </div>)
    }
}

export default MyMap;

