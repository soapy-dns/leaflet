# Leaflet Test

## Babel
uses babel to transpile javascript, so can use ES2015.  .babelrc also has 2 plugins
transform-object-assign - allows the use of Object.assign
transform-object-rest-spread -allows the use of the object spread operator '...'

## Notes
I'm pretty certain that the semantic-ui.css cdn didn't properly scale models


I am using 'togeojson' npm package installed globally to convert gpx to geojson

togeojson file.kml > file.geojson
togeojson file.GPX > file.geojson