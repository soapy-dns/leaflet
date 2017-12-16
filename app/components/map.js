import React, {Component} from 'react'
import L, { Control, Marker, Map, GeoJSON } from 'leaflet';
import {BasemapLayer, TiledMapLayer} from 'esri-leaflet'

import Search from './search'


class MyMap extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const baseLayer = new BasemapLayer('Gray');

        // topo layer
        const topoLayer = new TiledMapLayer({
            url: 'http://maps.six.nsw.gov.au/arcgis/rest/services/public/NSW_Topo_Map/MapServer'
        });

        // satellite image layer
        const imageLayer = new TiledMapLayer({
            url: 'http://maps.six.nsw.gov.au/arcgis/rest/services/public/NSW_Imagery/MapServer'
        });

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

        const tracksLayer = new GeoJSON(myLines)

        const baseMaps = {
            "Base": baseLayer,
        }
        const overlayMaps = {
            "Topo": topoLayer,
            "Image": imageLayer,
            "Tracks": tracksLayer
        }

        const mymap =  new Map('mapid', {
            center: [-33.75999, -209.59236],
            zoom: 14,
            maxZoom: 16,
            layers: [baseLayer, topoLayer]
        })



        const layers = new Control.Layers(baseMaps, overlayMaps);
        layers.addTo(mymap);


        const scale = new Control.Scale();
        scale.addTo(mymap);

        var marker = L.marker([-33.75999, -209.59236]).addTo(mymap);

    }

    render() {
        return (<div id="mapid">
            <Search />
        </div>)
    }
}

export default MyMap;
