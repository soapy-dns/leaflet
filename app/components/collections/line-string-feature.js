import React from 'react'
import PropTypes from 'prop-types'
import {Icon} from 'semantic-ui-react'

const LineString = (props) => (
    <span>
        <Icon color="blue" size="large" name='compass'/>
        {props.featureName}
    </span>
)

LineString.propTypes = {
    featureName: PropTypes.string
}

export default LineString
