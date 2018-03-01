// import L, {Control, Marker, Map, GeoJSON} from 'leaflet'
import {Icon} from 'leaflet'  // should probably only import what we need

//https://gis.stackexchange.com/questions/240738/control-custom-panes-for-leaflet-geojson-svg-icons


export const flameIcon = new Icon({
    iconUrl: 'assets/images/flames.png',
    iconSize: [38, 38], // size of the icon
    // shadowSize:   [50, 64], // size of the shadow
    iconAnchor: [22, 38], // point of the icon which will correspond to marker's location
    // shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
})

export const startIcon = new Icon({
    iconUrl: 'assets/svg/start.svg',
    // iconUrl: 'assets/svg/rect.svg',
    iconSize: [32, 32],
    iconAnchor: [0, 16],
    popupAnchor: [0, -28]
})

export const markerIcon = new L.Icon.Default({
    shadowSize: [0, 0]
})
