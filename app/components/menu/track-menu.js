import React, {Component} from 'react'
import { Menu, Dropdown } from 'semantic-ui-react'

import PropTypes from 'prop-types'

class TrackMenu extends Component {
    constructor(props) {
        super(props)

    }

    componentDidMount() {
        console.log('TrackMenu component did mount')
    }


    render() {
        const {
            onStop,
            onCancel,
            onHelp,
            trackElevation,
            autoCorrectTrack
        } = this.props

        return (
            <Menu id="mainmenu" compact >
                <Menu.Item onClick={trackElevation}>
                    Show Elevation
                </Menu.Item>
                <Menu.Item onClick={autoCorrectTrack}>
                    Auto Correct
                </Menu.Item>
                <Menu.Item onClick={onStop}>
                    Stop
                </Menu.Item>

                <Menu.Item onClick={onCancel}>
                    Cancel
                </Menu.Item>

                <Menu.Item onClick={onHelp}>
                    Help
                </Menu.Item>
            </Menu>
        )
    }
}

TrackMenu.propTypes = {
    onStop: PropTypes.func,
    onCancel: PropTypes.func,
    onHelp: PropTypes.func,
    trackElevation: PropTypes.func,
    autoCorrectTrack: PropTypes.func
}

export default TrackMenu


