import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Header, Modal, Button, Form, Message } from 'semantic-ui-react'
import { fromLatLon } from 'utm'
// const utm = require('utm')



import isEmpty from '../utils/is-empty'

//02 47600 62 63400
class WaypointModal extends Component {
    constructor(props) {
        super(props)

        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.validate = this.validate.bind(this)

        this.state = {
            pointName: null,
            northing: null,
            easting: null,
            zone: 56,
            band: 'H',
            errors: {}
        }
    }

    componentDidMount() {
        const { selectedLatitude, selectedLongitude } = this.props
        console.log('selectedLatitude', selectedLatitude)
        console.log('selectedLongitude', selectedLongitude)
        // get latlng from selected position.
        console.log('fromLatLon', fromLatLon)
        // const x = fromLatLon(selectedLatitude, selectedLongitude)
        // console.log('x', x)
        const { easting, northing, zoneNum, zoneLetter } = fromLatLon(selectedLatitude, selectedLongitude)
        //
        this.setState({ easting: Math.round(easting), northing: Math.round(northing), zone: zoneNum, band: zoneLetter})
        console.log('easting', easting)


    }

    onChange(event) {
        const name = event.target.name
        this.setState( { [name]: event.target.value })
    }

    validate() {
        console.log('validate')
        const errors = {}
        const { pointName } = this.state
        console.log('state-', this.state)
        if (!pointName) errors.pointName = 'Please enter a name for the waypoint'

        // todo - check easting / northing

        return errors
    }

    onSubmit(event) {
        event.preventDefault()  // todo - check if still need this
        const errors = this.validate()
        console.log('onSubmit', this.state)

        const { okAction } = this.props

        const formData = {
            pointName: this.state.pointName,
            easting: this.state.easting,
            northing: this.state.northing,
            zone: this.state.zone,
            band: this.state.band
        }
        // validate
        console.log('onSubmit - okAction', okAction)
        console.log('locate errors?', errors)
        if (isEmpty(errors)) okAction(formData)
        this.setState({ errors: errors })
    }

    render() {
        const { cancelAction } = this.props
        const { easting, northing, errors, zone, band } = this.state
        console.log(easting, northing, errors, zone, band )
        return (
            <Modal size='mini' open>
                <Modal.Header>Add a waypoint</Modal.Header>
                <Modal.Content>
                    <Form size="tiny" onSubmit={this.onSubmit} error>
                        <Form.Field>
                            <Form.Input label="Name" name="pointName" placeholder='blah blah' onChange={this.onChange} error={!!errors.pointName} />
                            {!!errors.pointName ? (
                                <div className="error">Waypoint name</div>
                            ) : null}
                        </Form.Field>
                        <Form.Field>
                            <Form.Input label="Easting" type="number" name="easting" placeholder='0247600' onChange={this.onChange} error={!!errors.easting} value={easting} />
                            {!!errors.easting ? (
                                <div className="error">Easting must be entered, and have 7 characters</div>
                            ) : null}
                        </Form.Field>
                        <Form.Field>
                            <Form.Input label="Northing" type="number" name="northing" placeholder='6263400' onChange={this.onChange} error={!!errors.northing} value={northing} />
                            {!!errors.northing ? (
                                <div className="error">Northing must be entered, and have 7 characters</div>
                            ) : null}
                        </Form.Field>

                        <Form.Field width="3">
                            <label>Zone</label>
                            <input value={zone} readOnly/>
                        </Form.Field>
                        <Form.Field width="3">
                            <label>Latitude band</label>
                            <input value={band} readOnly/>
                        </Form.Field>

                        <Modal.Actions>
                            <Button basic color="blue" onClick={cancelAction}>CANCEL</Button>
                            <Button type='submit' color="blue">ADD</Button>
                        </Modal.Actions>
                    </Form>
                </Modal.Content>
            </Modal>
        )
    }
}


WaypointModal.propTypes = {
    // heading: PropTypes.string,
    // content: PropTypes.string,
    okAction: PropTypes.func,
    cancelAction: PropTypes.func,
    selectedLatitude: PropTypes.number,
    selectedLongitude: PropTypes.number

}

export default WaypointModal

