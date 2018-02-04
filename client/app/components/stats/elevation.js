import React, { Component } from 'react'
import { Button, Icon, Menu, Label, Input } from 'semantic-ui-react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Line } from 'react-chartjs-2'

class Elevation extends Component {
    constructor(props) {
        super(props)

        // this.toggleCurrentTrackMenu = this.toggleCurrentTrackMenu.bind(this)
    }

    componentDidMount() {
        console.log('search component did mount')
    }


    render() {
        const data = {
            labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets: [
                {
                    label: 'My First dataset',
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: 'rgba(75,192,192,0.4)',
                    borderColor: 'rgba(75,192,192,1)',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: 'rgba(75,192,192,1)',
                    pointBackgroundColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                    pointHoverBorderColor: 'rgba(220,220,220,1)',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: [65, 59, 80, 81, 56, 55, 40]
                }
            ]
        };
        return (
            <div className="elevationPlot" >
                <Line data={data} />
            </div>

        )
    }
}

Elevation.propTypes = {
    dispatch: PropTypes.func,
    currentLayer: PropTypes.object
}

function mapStateToProps(state) {
    return {
        currentLayer: state.currentLayer
    }
}

export default connect(mapStateToProps)(Elevation)
//
// <div id="elevation" className="open" >Test graph</div>
//
// #elevation {
//     background: rgba(255, 255, 255, 1);
//     opacity: .6;
//     height: 100vh;
//     width: 300px;
//     position: absolute;
//     bottom: -100px;
//     z-index: 999;
//     transition: .5s bottom;
//     padding: 20px;
//     box-sizing: border-box;
// }
// #elevation.open {
//     bottom: 0;
//     opacity: .95;
// }
