import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Header, Modal, Button, Form, Message } from 'semantic-ui-react';

import isEmpty from '../utils/is-empty'

//02 47600 62 63400
class LocateModal extends Component {
    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.validate = this.validate.bind(this)

        this.state = {
            easting: null,
            northing: null,
            zone: 56,
            band: 'H',
            errors: {}
        };
    }

    onChange(event) {
        const name = event.target.name
        this.setState( { [name]: event.target.value })
    }

    validate() {
        console.log('validate')
        const errors = {}
        const { easting } = this.state
        console.log('state-', this.state)
        if (!easting) errors.easting = 'Please enter a value for easting'

        return errors
    }

    onSubmit(event) {
        event.preventDefault();  // todo - check if still need this
        const errors = this.validate()
        console.log('onSubmit', this.state)

        const { okAction } = this.props
        const formData = {
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
        const { errors, zone, band } = this.state
        return (
            <Modal size='mini' open>
                <Modal.Header>Locate</Modal.Header>
                <Modal.Content>
                    <Form size="tiny" onSubmit={this.onSubmit} error>
                        <Form.Field>
                            <Form.Input label="Easting" type="number" name="easting" placeholder='0247600' onChange={this.onChange} error={!!errors.easting} />
                            {!!errors.easting ? (
                                <div className="error">Easting must be entered, and have 7 characters</div>
                                ) : null}
                        </Form.Field>
                        <Form.Field>
                            <Form.Input label="Northing" type="number" name="northing" placeholder='6263400' onChange={this.onChange} error={!!errors.northing} />
                            {!!errors.easting ? (
                                <div className="error">Northing must be entered, and have 7 characters</div>
                            ) : null}
                        </Form.Field>
                        <Form.Field width="3">
                            <label>Zone</label>
                            <input value={zone} readonly/>
                        </Form.Field>
                        <Form.Field width="3">
                            <label>Latitude band</label>
                            <input value={band} readonly/>
                        </Form.Field>

                        <Modal.Actions>
                            <Button basic color="blue" onClick={cancelAction}>CANCEL</Button>
                            <Button type='submit' color="blue">LOCATE</Button>
                        </Modal.Actions>
                    </Form>
                </Modal.Content>
            </Modal>
        )
    }
}


LocateModal.propTypes = {
    // heading: PropTypes.string,
    // content: PropTypes.string,
    okAction: PropTypes.func,
    cancelAction: PropTypes.func
};

export default LocateModal;

