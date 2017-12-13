import React, {Component} from 'react'
import { Control, Marker, Map } from 'leaflet';
import {BasemapLayer, TiledMapLayer} from 'esri-leaflet'


class MyMap extends Component {
    constructor(props) {
        super(props);

    }

    componentDidMount() {
        // const baseLayer = L.esri.basemapLayer("Gray");
        const baseLayer = new BasemapLayer('Gray');

        // topo layer
        const topoLayer = new TiledMapLayer({
            url: 'http://maps.six.nsw.gov.au/arcgis/rest/services/public/NSW_Topo_Map/MapServer'
        });

        // satellite image layer
        const imageLayer = new TiledMapLayer({
            url: 'http://maps.six.nsw.gov.au/arcgis/rest/services/public/NSW_Imagery/MapServer'
        });

        const mymap =  new Map('mapid', {
            center: [-33.75999, -209.59236],
            zoom: 10,
            layers: [baseLayer, topoLayer]
        });

        const baseMaps = {
            // "Base": baseLayer,
            "Topo": topoLayer
        };
        const overlayMaps = {
            "Image": imageLayer
        };


        const layers = new Control.Layers(baseMaps, overlayMaps);
        layers.addTo(mymap);

        const scale = new Control.Scale();
        scale.addTo(mymap);
    }

    render() {
        return (<div id="mapid"></div>)
    }
}

export default MyMap;
