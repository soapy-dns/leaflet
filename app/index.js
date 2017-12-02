// import {EsriLeaflet} from 'esri-leaflet';
import { BasemapLayer, TiledMapLayer } from 'esri-leaflet';
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
const mymap = L.map('mapid', {
    center: [-33.75999, -209.59236],
    zoom: 10,
    layers: [baseLayer, topoLayer]
});

const baseMaps = {
    "Base": baseLayer,
    "Topo": topoLayer
};
const overlayMaps = {
    "Image": imageLayer
};
L.control.layers(baseMaps, overlayMaps).addTo(mymap);


/*
 Add marker with popup
 */
//    const marker = L.marker([56.4620, -2.9707]).addTo(mymap);
//    marker.bindPopup("<b>Dundee</b><br>Navel of the universe.").openPopup();

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