import { Control } from 'leaflet'
import { fromLatLon } from 'utm'
import nswMapBounds from './nsw-map-bounds'

const MouseControl = Control.extend({
    onAdd: function(map) {
        console.log('add')
        const className = 'leaflet-control-mouseCoordinate'
        const container = this._container = L.DomUtil.create('div', className)

        this._gpsPositionContainer = L.DomUtil.create("div", "gpsPos", container)

        map.on("mousemove", this._update, this)

        return container
    },

    onRemove: function(map) {
        // Nothing to do here
    },

    _update: function(e) {
        let lat = (e.latlng.lat + 90) % 180
        let lng = (e.latlng.lng + 180) % 360
        if (lat < 0) {
            lat += 180
        }
        lat -= 90
        if (lng < 0) {
            lng += 360
        }
        lng -= 180

        let content = "<table>"

        const { easting, northing, zoneNum, zoneLetter } = fromLatLon(lat, lng)

        content += "<tr><td>UTM</td><td colspan='2'>" + zoneNum + "&nbsp" + zoneLetter + "&nbsp" + easting.toFixed(0) + "&nbsp" + northing.toFixed(0) + "</td></tr>"

        const sixfigure = this._to6Figure(easting, northing)
        const nswmap = this._nswMapRef(lat, lng)
        content += "<table><tr><td>"+nswmap+"</td><td>"+sixfigure+"</td></tr></table>"
        
        content += "</table>"
        this._gpsPositionContainer.innerHTML = content
    },

    _nswMapGridRef: function(lat, lng) {
        var X = Math.floor(lng * 2) - 211
        if (X < 10) X = '0' + X
        var Y = Math.floor(lat * 2) + 98
        if (Y < 10) Y = '0' + Y

        if ((lat % 0.5) < -0.25) {
            var s25k = [X, Y, '-', ((lng % 0.5) >= 0.25) ? 2 : 3, ((lat % 0.25) > -0.125) ? 'N' : 'S'].join('')
            var s50k = [X, Y, '-', 'S'].join('')
        } else {
            var s25k = [X, Y, '-', ((lng % 0.5) >= 0.25) ? 1 : 4, ((lat % 0.25) > -0.125) ? 'N' : 'S'].join('')
            var s50k = [X, Y, '-', 'N'].join('')
        }
        var s100k = [X, Y].join('')
        return [s25k, s50k, s100k]
    },

    _nswMapRef: function(lat, lng) {
        const mapGrid = this._nswMapGridRef(lat, lng)

        const mapList = {}
        for (let i = 0; i < nswMapBounds.length; i++) {
            mapList[nswMapBounds[i].mapNumber] = nswMapBounds[i].mapTitle
        }

        if (mapGrid[0] in mapList) {
            return mapList[mapGrid[0]]
        }
        else if (mapGrid[1] in mapList) {
            return mapList[mapGrid[1]]
        }
        else if (mapGrid[2] in mapList) {
            return mapList[mapGrid[2]]
        }
        else return ''
    },

    _to6Figure: function (easting, northing){
        return easting.toFixed(0).substr(2,3) + '-' + northing.toFixed(0).substr(2,3)
    }
})

export default MouseControl
