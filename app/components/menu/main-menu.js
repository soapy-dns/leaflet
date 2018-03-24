import React, {Component} from 'react'
import { Menu, Dropdown } from 'semantic-ui-react'

import PropTypes from 'prop-types'

class MainMenu extends Component {
    constructor(props) {
        super(props)

    }

    componentDidMount() {
        console.log('MainMenu component did mount')
    }


    render() {
        const {
            locate,
            awaitingFunctionality,
            openFile,
            centreOnCurrentLocation,
            drawLine,
            stopDrawLine,
            addWaypoint,
            getMajorIncidents,
            autoCorrectTrack,
            showElevationPlot,
            onEdit
        } = this.props

        return (
            <Menu id="mainmenu" compact >
                <Menu.Item onClick={openFile}>
                    Open
                </Menu.Item>

                <Dropdown text='New' className='link item'>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={addWaypoint}>Waypoint</Dropdown.Item>
                        <Dropdown.Item onClick={drawLine}>Track</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>

                <Dropdown text='Selected Track' className='link item'>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={autoCorrectTrack}>Auto correct</Dropdown.Item>
                        <Dropdown.Item onClick={showElevationPlot}>Show Elevation Plot</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>

                <Dropdown text='Other'  className='link item'>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={centreOnCurrentLocation}>
                            Centre on current location
                        </Dropdown.Item>
                        <Dropdown.Item onClick={locate}>Locate</Dropdown.Item>
                        <Dropdown.Item onClick={getMajorIncidents}>Major Incidents</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>

            </Menu>
        )
    }
}

MainMenu.propTypes = {
    locate: PropTypes.func,
    awaitingFunctionality: PropTypes.func,
    centreOnCurrentLocation: PropTypes.func,
    openFile: PropTypes.func,
    okAction: PropTypes.func,
    cancelAction: PropTypes.func,
    addWaypoint: PropTypes.func,
    drawLine: PropTypes.func,
    stopDrawLine: PropTypes.func,
    getMajorIncidents: PropTypes.func,
    autoCorrectTrack: PropTypes.func,
    showElevationPlot: PropTypes.func
}

export default MainMenu


