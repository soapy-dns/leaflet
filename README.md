# Leaflet Test

##Overview
The ultimate goal is for this to be a replacement for basecamp which sucks cos they appear to be too busy making money to
keep their tech updated.
This only deals with NSW, cos that's all I need.
Defining features of this vs other offerings are
    * can deal with multiple routes at once.
    * is completely on the browser


## Babel
uses babel to transpile javascript, so can use ES2015.  .babelrc also has 2 plugins
transform-object-assign - allows the use of Object.assign
transform-object-rest-spread -allows the use of the object spread operator '...'

## Notes
I'm pretty certain that the semantic-ui.css cdn didn't properly scale models


I am using 'togeojson' npm package installed globally to convert gpx to geojson

togeojson file.kml > file.geojson
togeojson file.GPX > file.geojson


## Redux store structure
ui - user interface stuff included selected lines and waypoints
feature-collections - lists all the 'files' or collections of features

##handy links
http://geojson.io/
https://github.com/mapbox/geojson.io
https://github.com/mapbox/geojsonhint
https://gis.stackexchange.com/questions/240738/control-custom-panes-for-leaflet-geojson-svg-icons
