import React, {Component} from 'react'
import L, {Control, Marker, Map, GeoJSON} from 'leaflet'
import {BasemapLayer, TiledMapLayer} from 'esri-leaflet'
const utmObj = require('utm-latlng');
const utm = new utmObj(); //Default Ellipsoid is 'WGS 84'

import Search from './search'
import Location from './location'
import track from '../data/arethusa'
import Toolbar from './toolbar'
import LoadTrackModal from './load-track-modal'
// import Sidebar from './sidebar'
import Locate from './locate-modal'

class MyMap extends Component {
    constructor(props) {
        super(props);
        // this.onLocationError = this.onLocationError.bind(this)
        // this.onLocationFound = this.onLocationFound.bind(this)
        this.onCancelAction = this.onCancelAction.bind(this)
        this.onOkAction = this.onOkAction.bind(this)
        this.onLocate = this.onLocate.bind(this)


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

        const myTrack = track.features[0].geometry
        const tracksLayer = new GeoJSON([myTrack])

        const baseMaps = {
            "Base": baseLayer,
        }
        const overlayMaps = {
            "Topo": topoLayer,
            "Image": imageLayer,
            "Tracks": tracksLayer
        }


        // const map = new Map('mapid', {
        //     // center: [-33.75999, -209.59236],
        //     center: [-33.668759325519204, 150.34924333915114],
        //     zoom: 14,
        //     maxZoom: 16,
        //     layers: [baseLayer, topoLayer],
        // })
        // map.zoomControl.setPosition('bottomright');

        // location position
        // -----------------
        // map.locate({setView: true, maxZoom: 16})
        // map.on('locationerror', onLocationError)
        // map.on('locationfound', onLocationFound);
        //
        // function onLocationError(e) {
        //     alert(e.message)
        // }
        //
        // function onLocationFound(e)  {
        //     console.log('onLocation found', e)
        //     var radius = e.accuracy / 2;
        //     console.log(`you are within ${radius} meters from this point`)
        //
        //     L.circle(e.latlng, radius).addTo(map).bindPopup("You are located within this circle").openPopup()
        // }

        // add control button for layers
        // const layersControl = new Control.Layers(baseMaps, overlayMaps)
        // layersControl.addTo(map)
        //
        // // add scale
        // const scale = new Control.Scale()
        // scale.addTo(map)

    }

    onOkAction() {
        console.log('ok action')
    }

    onCancelAction() {
        console.log('cancelAction')
    }

    onLocate() {
        console.log('locate')
        this.setState({ modal: 'locate' })
    }

    render() {
        // todo - I think the toolbar should be another level up eg within main
        console.log('locate?', this.state.modal)
        console.log('this.onCancelAction', this.onCancelAction)
        return (
            <div id="mapwrap">
                {(this.state.modal === 'locate') ? (
                    <LoadTrackModal cancelAction={this.onCancelAction} okAction={this.onOkAction} />
                ) : null}

                <Locate cancelAction={this.onCancelAction} okAction={this.onOkAction} />

                <Toolbar locate={this.onLocate} />
                <div id="mapid"></div>


            </div>)
    }
}

export default MyMap;

