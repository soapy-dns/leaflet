# Leaflet Test

## Overview
The ultimate goal is for this to be a replacement for basecamp which sucks cos they appear to be too busy making money to
keep their tech updated.
This only deals with NSW, cos that's all I need.
Defining features of this vs other offerings are
    * can deal with multiple routes at once.
    * is completely on the browser


## Babel
uses babel to transpile javascript, so can use more modern versions of javascript.  .babelrc also has 2 plugins
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


## compression
https://hackernoon.com/optimising-your-application-bundle-size-with-webpack-e85b00bab579

Using https://testmysite.thinkwithgoogle.com/ the load time is 22s!

The webpack bundle is > 8MB

### redux-persist
https://blog.reactnativecoach.com/the-definitive-guide-to-redux-persist-84738167975

### react dnd
http://react-dnd.github.io/react-dnd/
https://react-dnd.github.io/react-dnd/docs-tutorial.html

### data stores
There are 2 types of data store here.  The map and the redux store.
The map is the source of truth.  Redux is only used for refreshes / restarts, and for manipulating
collections / features etc.  The reason for having it this way round, and not having
redux as the source of truth is because we can make use of leaflets methods eg setBounds etc


fullscreen
https://github.com/brunob/leaflet.fullscreen

mouse coords
https://github.com/PowerPan/leaflet.mouseCoordinate

antpath
https://github.com/rubenspgcavalcante/leaflet-ant-path

drawing

leaflet draw plugin.  works ok - adding point to an existing line may be an issue.
https://leaflet.github.io/Leaflet.draw/docs/leaflet-draw-latest.html#l-draw
http://www.d3noob.org/2014/01/using-leafletdraw-plugin-for-leafletjs.html

http://tkrajina.github.io/leaflet-editable-polyline/example1.html
https://github.com/codeofsumit/leaflet.pm

It seems that rather than using geojson for lines, I'd be better using L.Polylines

id in leaflet layers
https://stackoverflow.com/questions/34322864/finding-a-specific-layer-in-a-leaflet-layergroup-where-layers-are-polygons

## Dependencies
@mapbox/togeojson -
chart.js -
esri-leaflet
leaflet -
leaflet.pm
leaflet.utm - I don't think this is still used
react-dnd - drag and drop
react-dnd-html5-backend - draga and drop
react-chartjs-2
utm
