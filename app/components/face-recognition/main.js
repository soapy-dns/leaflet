
import React, { Component } from 'react'
import { browserHistory } from 'react-router';
import PropTypes from 'prop-types'
import Api from '../../utils/api'
import { Button } from 'semantic-ui-react'
import '../../styles/face-styles.css'

class Face extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        console.log('face component did mount')

    }

    render() {
        return (
            <div class="face-container">
                <h1>
                    Facial Recognition
                </h1>
                <div class="m-t-2">
                    <p>
                        If you'd like to load up new images to train the facial recognition use this:-
                    </p>
                    <div>
                        <Button id="learn" onClick={(e) => browserHistory.push('/learn')} primary>Load and Learn</Button>
                    </div>
                </div>
                <div class="m-t-2">
                    <p>
                        If you'd like to identify faces from an existing dataset, use this:-
                    </p>
                    <div>
                        <Button id="identify" onClick={(e) => browserHistory.push('/identify')} primary>Identify</Button>
                    </div>
                </div>
            </div>

        )
    }
}

Face.propTypes = {
    map: PropTypes.object.isRequired,
}

export default Face
