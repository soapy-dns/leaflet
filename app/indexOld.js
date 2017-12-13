// import {EsriLeaflet} from 'esri-leaflet';
import { BasemapLayer, TiledMapLayer } from 'esri-leaflet';
// import { x } from 'leaflet.filelayer';

import { Control, Marker, Map } from 'leaflet';
// import

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

//    const mymap = L.map('mapid').setView([-33.75999, -209.59236], 15);
const mymap = new Map('mapid', {
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

// const control = new L.Control();
// console.log('control', control)
// Control.fileLayerLoad({
//
//     // Allows you to use a customized version of L.geoJson.
//     // For example if you are using the Proj4Leaflet leaflet plugin,
//     // you can pass L.Proj.geoJson and load the files into the
//     // L.Proj.GeoJson instead of the L.geoJson.
//     layer: L.geoJson,
//     // See http://leafletjs.com/reference.html#geojson-options
//     layerOptions: {style: {color:'red'}},
//     // Add to map after loading (default: true) ?
//     addToMap: true,
//     // File size limit in kb (default: 1024) ?
//     fileSizeLimit: 1024,
//     // Restrict accepted file formats (default: .geojson, .json, .kml, and .gpx) ?
//     formats: [
//         '.geojson',
//         '.kml'
//     ]
// }).addTo(mymap);

// console.log(fileLayer)
// fileLayer.addTo(mymap);
/*
 Add marker with popup
 */
// const marker = new Marker([-33.75999, -209.59236]).addTo(mymap);
// marker.getLatLng().utm()
//    const marker = L.marker([56.4620, -2.9707]).addTo(mymap);
//    marker.bindPopup(marker.getLatLng()).openPopup();

//    http://maps.six.nsw.gov.au/arcgis/rest/services/public/NSW_Topo_Map/MapServer/tile/13/4911/7516

/*
 Add a polygon - encloses an area
 */
//    var polygon = L.polygon([
//        [56.469, -2.971],
//        [56.4620, -2.9707],
//        [56.4500, -2.96]
//    ]).addTo(mymap);

/*
 Add event
 */
const popup = L.popup();

function onMapClick(e) {
    console.log('onClick')
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(mymap);
}

mymap.on('click', onMapClick);


/*
 Add a line with geoJson
 */
//    const myLines = [{
//        "type": "LineString",
//        "coordinates": [[56.468, -2.971],
//            [56.4610, -2.9707],
//            [56.4490, -2.96]]
//    }, {
//        "type": "LineString",
//        "coordinates": [[56.467, -2.971],
//            [56.4600, -2.9707],
//            [56.4480, -2.96]]
//    }];

//    const myLayer = L.geoJSON().addTo(mymap);
//    myLayer.addData(myLines);
//
//    const geojsonFeature = {
//        "type": "Feature",
//        "properties": {
//            "name": "Coors Field",
//            "amenity": "Baseball Stadium",
//            "popupContent": "This is where the Rockies play!"
//        },
//        "geometry": {
//            "type": "Point",
//            "coordinates": [56.4480, -2.96]
//        }
//    };
//    myLayer.addData(geojsonFeature);