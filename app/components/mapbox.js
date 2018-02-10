import React, {Component} from 'react'
import L, { Control, Marker, Map, GeoJSON } from 'leaflet';

import Search from './search'


class MyMap extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        // const baseLayer = L.esri.basemapLayer("Gray");
        // const baseLayer = new BasemapLayer('Gray');

        // topo layer
        // const topoLayer = new TiledMapLayer({
        //     url: 'http://maps.six.nsw.gov.au/arcgis/rest/services/public/NSW_Topo_Map/MapServer'
        // });
        //
        // // satellite image layer
        // const imageLayer = new TiledMapLayer({
        //     url: 'http://maps.six.nsw.gov.au/arcgis/rest/services/public/NSW_Imagery/MapServer'
        // });
        const mymap = L.map('mapid').setView([56.4620, -2.9707], 13);
        //Add tile layer
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoic29hcHkiLCJhIjoiY2phYXJxdjJxMGtoaDM1cGUyNGtsYm9ncCJ9.QAGev1jwbYm4IoijOOlksA', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox.streets'
            //        accessToken: 'your.mapbox.access.token'
        }).addTo(mymap);

        const scale = new Control.Scale();
        scale.addTo(mymap);

        var marker = L.marker([56.468, -2.971]).addTo(mymap);

        //Add a line with geoJson
        const myLines = [{
            "type": "LineString",
            "coordinates": [[-2.971, 56.468],
                [-2.9707, 56.4610 ]]
        }]
        // , {
        //     "type": "LineString",
        //     "coordinates": [[56.467, -2.971],
        //         [56.4600, -2.9707],
        //         [56.4480, -2.96]]
        // }];
        // const myLayer = L.geoJSON().addTo(mymap);
        // myLayer.addData(myLines);
        L.geoJSON(myLines).addTo(mymap);

    }

    render() {
        return (<div id="mapid">
            <Search />
        </div>)
    }
}

export default MyMap;
