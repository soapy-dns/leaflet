import React, {Component} from 'react'
import { Menu, Dropdown } from 'semantic-ui-react'

import PropTypes from 'prop-types'

class DrawingMenu extends Component {
    constructor(props) {
        super(props)

    }

    componentDidMount() {
        console.log('DrawingMenu component did mount')
    }


    render() {
        const {
            onStop,
            onCancel,
            onHelp
        } = this.props

        return (
            <Menu id="mainmenu" compact >
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

DrawingMenu.propTypes = {
    onStop: PropTypes.func,
    onCancel: PropTypes.func,
    onHelp: PropTypes.func
}

export default DrawingMenu


