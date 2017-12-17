import React, {Component} from 'react'
import L, { Control, Marker, Map, GeoJSON } from 'leaflet'
import {BasemapLayer, TiledMapLayer} from 'esri-leaflet'

import Search from './search'
import Location from './location'
import track from '../data/arethusa'
import Toolbar from './toolbar'

class MyMap extends Component {
    constructor(props) {
        super(props);
        // this.onLocationError = this.onLocationError.bind(this)
        // this.onLocationFound = this.onLocationFound.bind(this)
        this.state = {
            locate: false,
            // map: null
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

        const myStyle = {
            "color": "#ff7800",
            "weight": 5,
            "opacity": 0.65
        }
        const myLines = [{
            "type": "LineString",
            "coordinates": [[ -209.59236, -33.75999],
                [-209.59238, -33.76988],
                [-209.59240, -33.75989]]
        }]
        // console.log('myTrack', track.features[0].geometry)
        const myTrack = track.features[0].geometry

        // const tracksLayer = new GeoJSON(myLines)
        const tracksLayer = new GeoJSON([myTrack])


        const baseMaps = {
            "Base": baseLayer,
        }
        const overlayMaps = {
            "Topo": topoLayer,
            "Image": imageLayer,
            "Tracks": tracksLayer
        }

        const map = new Map('mapid', {
            // center: [-33.75999, -209.59236],
            center:    [-33.668759325519204, 150.34924333915114 ],
            zoom: 14,
            maxZoom: 16,
            layers: [baseLayer, topoLayer],
            // zoomControl: false
        })
        map.zoomControl.setPosition('bottomright');

        // L.control.zoom({position: "bottomRight"}).addTo(map)

        // location position
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
        const layersControl = new Control.Layers(baseMaps, overlayMaps)
        layersControl.addTo(map)

        // add scale
        const scale = new Control.Scale()
        scale.addTo(map)

    }


    render() {
        return (<div id="mapwrap">
            <Search />
            <Toolbar />
            <div id="mapid"></div>
        </div>)

    }
}

export default MyMap;

// return (<div id="mapid">
//         <Search />
//     </div>)

