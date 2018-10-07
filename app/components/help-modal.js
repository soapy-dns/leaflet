import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Button, Modal } from 'semantic-ui-react'


class HelpModal extends Component {
    constructor (props) {
        super(props)
        this.state = {
        }
    }

    render () {
        const { cancelAction } = this.props
        console.log('help-modal')
        return (
            <Modal open>
                <Modal.Header>CRUDy Help</Modal.Header>
                <Modal.Content>
                    This help is separated into 4 parts Create, Read, Update and Delete
                    <h1>Terminology</h1>
                    <ul>
                        <li><em>File</em> - A gpx, kml, or geojson file</li>
                        <li><em>Feature</em> - An item within the file.  This can be a track or a waypoint</li>
                        <li><em>Track</em>- A line created by linking positions at regular intervals</li>
                        <li><em>Waypoint</em>- A stand alone recording of position.  This can have text associated with it.</li>
                    </ul>
                    <h1>Editing existing stuff</h1>
                    <h2>Opening an existing file</h2>
                    <p>This can be a gpx, kml or geojson file</p>
                    <p>The file can contain multiple 'features' of type track or waypoint</p>
                    <p>
                        By pressing the 'Files' button on the left hand side, a tab will open.
                        This show the files opened (an icon will indicate which file is open / selected) in the top section,
                        and the feature items in the file (waypoints and tracks) in the bottom section.
                        If a file is changed, a save icon will appear beside the file name.  Pressing this will save the file to your computer.
                        It is possible to delete a file by pressing the red X icon to the right of the file name.
                        Each feature is identified by an icon to indicate its type - a compass for a track or a pointer for a waypoint.
                        It is possible to drag and drop file items to copy them into a different file.


                    </p>
                    <p>To remove the file, </p>
                    <hr />
                    <h1>Viewing</h1>
                    <h2>To view a waypoint's details click on it</h2>
                    <hr />
                    <h2>Editing a track</h2>
                    <p>Hover over the track, then press a mouse key</p>
                    <hr />
                    <h2>Moving a waypoint</h2>
                    <p>select the waypoint by clicking and holding down.  Move the mouse to drag the waypoint.  Stop holding down the mouse key and the waypoint will stay where you drop it.</p>

                    <h1>Creating new stuff</h1>
                    <h2>Creating a new file</h2>
                    <p>Work in progress</p>
                    <hr />
                    <h2>Creating a new waypoint</h2>
                    <p>New > waypoint.  This will be added to the selected file</p>
                    <p>To select a line, hover over it until the styling changes, then press with the mouse</p>
                    <hr />
                    <h2>Issues</h2>
                    <ol>
                        <li>It is not possible to unselect a Line</li>
                        <li>Moving a waypoint does update the file as having changed</li>
                        <li>Drag and drop of the file items is not working</li>
                    </ol>
                </Modal.Content>
                <Modal.Actions>
                    <Button basic color="blue" onClick={cancelAction}>Back</Button>
                </Modal.Actions>
            </Modal>
        )
    }
}
HelpModal.propTypes = {
    cancelAction: PropTypes.func,
}

export default HelpModal
