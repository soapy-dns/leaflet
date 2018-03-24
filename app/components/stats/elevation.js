import React, { Component } from 'react'
import { Button } from 'semantic-ui-react'

import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Line } from 'react-chartjs-2'

import { getLine, getSelectedTrack } from '../../utils/index'

let elevationData = {}

class Elevation extends Component {
    constructor(props) {
        super(props)

        // this.toggleCurrentTrackMenu = this.toggleCurrentTrackMenu.bind(this)
    }

    componentDidMount() {
        console.log('elevation component did mount')
        // const track = this.props.currentLayer
        //
        // if (track) {
        //     const line = getLine(track)
        //     console.log('gotLineTrack', !!line)
        //     elevationData.labels = line.properties.coordTimes  // x axis
        //     elevationData.yaxis = line.geometry.coordinates.map(it => it[2])
        //     console.log('x', elevationData.labels)
        //     console.log('y', elevationData.yaxis)
        //     console.log('line', line)
        // }
        //
        // const line = getLine(track)
        // console.log('line', line)

    }

    // /*
    // Check if the track has changed
    // todo - this should be using the selected track, not the current track
    //  */
    // shouldComponentUpdate(nextProps, nextState) {
    //     console.log('shouldComponentUpdate')
    //     const currentTrack = this.props.currentLayer
    //     const currentLine = getLine(currentTrack)
    //
    //     const nextTrack = nextProps.currentLayer
    //     const nextLine = getLine(nextTrack)
    //
    //
    //     if (currentLine.properties.name === nextLine.properties.name) {
    //         console.log('---------no change in track name - no update----------')
    //         return false
    //     }
    //     console.log('-------update plot------------')
    //     return true
    // }

    render() {
        console.log('render Elevation')
        const { hideElevationPlot, tracks } = this.props

        const track = getSelectedTrack(tracks)

        console.log('---track---', track)
        if (!track) return null

        const line = getLine(track)
        // console.log('gotLineTrack', !!line)
        elevationData.labels = line.properties.coordTimes  // x axis
        elevationData.yaxis = line.geometry.coordinates.map(it => it[2])
        // console.log('x', elevationData.labels)
        // console.log('y', elevationData.yaxis)
        // console.log('line', line)

        const data = {
            // labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            labels: elevationData.labels,
            // labels: ["2011-02-25T21:06:17Z", "2011-02-25T21:06:18Z", "2011-02-25T21:06:20Z", "2011-02-25T21:06:24Z", "2011-02-25T21:06:28Z"],
            datasets: [
                {
                    label: 'Elevation Plot',
                    fill: false,
                    lineTension: 0,  // straight lines between points - more performant
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
                    // xAxes: [
                    //     { scaleLabel: {
                    //         display: true,
                    //         labelString: 'Score (%)' },
                    //         ticks: { max: 100, min: 0, stepSize: 10, } }],
                    data: elevationData.yaxis
                    // data: [995.1, 995.58, 996.54, 997.02, 997.02]
                    // data: [65, 59, 80, 81, 56, 55, 40]
                }
            ]

        }
        const options = {
            title: {
                display: false
            },
            legend: { display: true },
            showLines: true, // disable for all datasets
            scales: {
                xAxes: [{
                    type: 'time',
                    distribution: 'linear',

                    time: {
                        displayFormats: {
                            hour: 'MMM D hh:mm'
                        }
                    }
                }],
                yAxes: [
                    {
                        position: 'left',
                    }
                ]
            }

        }

        return (
            <div className="elevationPlot" >
                <Button icon='remove' basic className="closeButtonTopRight" onClick={hideElevationPlot} />
                <Line data={data} options={options} height={50} />
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
        tracks: state.tracks
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
