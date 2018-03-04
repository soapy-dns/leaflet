import React, { Component } from 'react'
import { Button, Icon, Menu, Label, Input } from 'semantic-ui-react'
import PropTypes from 'prop-types'

class Toolbar extends Component {
    constructor(props) {
        super(props)

        this.toggleVisibility = this.toggleVisibility.bind(this)
        this.state = {
            visible: false,
            activeItem: null,
            menu: {
                currentTrack: false
            }
        }
        this.toggleCurrentTrackMenu = this.toggleCurrentTrackMenu.bind(this)
    }

    componentDidMount() {
        console.log('search component did mount')
    }

    toggleVisibility() {
        console.log('toggle visibility')
        this.setState({visible: !this.state.visible})
    }

    toggleCurrentTrackMenu() {
        console.log('opend current track')
        const menu = Object.assign({}, this.state.menu)
        menu.currentTrack = !this.state.menu.currentTrack
        this.setState({ menu })
    }

    render() {
        const { activeItem } = this.state
        const { locate,
            awaitingFunctionality,
            openFile,
            centreOnCurrentLocation,
            drawLine,
            stopDrawLine,
            addWaypoint,
            // selectATrack,
            getMajorIncidents,
            autoCorrectTrack,
            showElevationPlot
        } = this.props

        return (
            <div id="toolbar" className={this.state.visible ? "open" : null}>
                <button className="hamburger" onClick={this.toggleVisibility}>
                    <span>Menu</span>
                </button>
                <div id="menu">
                    <Menu vertical borderless fluid>
                        <Menu.Item>
                            <Menu.Header>
                                Current Track
                                <Icon name="chevron down" onClick={this.toggleCurrentTrackMenu} link />
                            </Menu.Header>
                            {this.state.menu.currentTrack === true && (
                                <Menu.Menu>

                                <Menu.Item onClick={addWaypoint}>
                                    Add waypoint
                                </Menu.Item>

                                <Menu.Item onClick={autoCorrectTrack}>
                                    Autocorrect track
                                </Menu.Item>

                                <Menu.Item onClick={showElevationPlot}>
                                    Show elevation plot
                                </Menu.Item>
                            </Menu.Menu>
                            )}
                        </Menu.Item>

                        <Menu.Item>
                            <Menu.Header>
                                Create a new track
                                <Icon name="chevron down" onClick={this.toggleCurrentTrackMenu} link />
                            </Menu.Header>

                            <Menu.Menu>

                                <Menu.Item onClick={drawLine}>
                                    Draw Track
                                </Menu.Item>

                                <Menu.Item onClick={stopDrawLine}>
                                    Stop Drawing Track
                                </Menu.Item>
                            </Menu.Menu>
                        </Menu.Item>

                        <Menu.Item onClick={centreOnCurrentLocation}>
                            Centre on current location
                        </Menu.Item>

                        <Menu.Item onClick={locate}>
                            Locate
                        </Menu.Item>

                        <Menu.Item onClick={openFile}>
                            Open File
                        </Menu.Item>

                        <Menu.Item onClick={awaitingFunctionality}>
                            Choose map source
                        </Menu.Item>

                        <Menu.Item onClick={getMajorIncidents}>
                            Get Major Incidents
                        </Menu.Item>

                        <Menu.Item>
                            <Input icon='search' placeholder='Search for a track...' />
                        </Menu.Item>
                    </Menu>
                </div>
            </div>
        )
    }
}

Toolbar.propTypes = {
    locate: PropTypes.func,
    awaitingFunctionality: PropTypes.func,
    openFile: PropTypes.func,
    okAction: PropTypes.func,
    cancelAction: PropTypes.func,
    // selectATrack: PropTypes.func,
    addWaypoint: PropTypes.func,
    drawLine: PropTypes.func,
    stopDrawLine: PropTypes.func,
    getMajorIncidents: PropTypes.func,
    autoCorrectTrack: PropTypes.func,
    showElevationPlot: PropTypes.func
}

export default Toolbar
