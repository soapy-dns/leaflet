import React from 'react'
import PropTypes from 'prop-types'
import { Icon } from 'semantic-ui-react'

const Point = (props) => (
    <span>
        <Icon color="blue" size="large" name='marker'/>
        { props.featureName }
    </span>

)

Point.propTypes = {
    featureName: PropTypes.string
}

export default Point
