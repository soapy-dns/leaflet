import React, {Component} from 'react'
import PropTypes from 'prop-types';

class Location extends Component {
    constructor(props) {
        super(props);

    }

    componentDidMount() {
        console.log('location component did mount')
        // mymap.on('locationerror', this.onLocationError)
        // mymap.on('locationfound', this.onLocationFound);
        map.locate({setView: true, maxZoom: 16})
        map.on('locationerror', onLocationError)
        map.on('locationfound', onLocationFound);

        function onLocationError(e) {
            alert(e.message)
        }

        function onLocationFound(e)  {
            var radius = e.accuracy / 2;
            console.log(`you are within ${radius} meters from this point`)

            L.circle(e.latlng, radius).addTo(map).bindPopup("You are located within this circle").openPopup()
        }
    }

    render() {
        return (
            <div>
                LOCATION
            </div>
        )
    }
}

Location.propTypes = {
    map: PropTypes.object.isRequired,
};


export default Location;
