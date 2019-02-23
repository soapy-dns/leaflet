import React, { Component } from 'react'
import PropTypes from 'prop-types'


class DoubleClickField extends Component {
    constructor(props) {
        super(props)
        this.state = {
            edit: false,
            value: props.value
        }
        this.count = 0
        this.handleClick = this.handleClick.bind(this)
        this.onChange = this.onChange.bind(this)
    }

    handleClick() {
        const { onSelect } = this.props
        // cancel previous callback
        if (this.timeout) clearTimeout(this.timeout)

        // increment count
        this.count++

        // schedule new callback  [timeBetweenClicks] ms after last click
        this.timeout = setTimeout(() => {
            // listen for double clicks
            if (this.count === 2) {
                // call method in parent
                console.log('onSelect')
                onSelect()
            }

            // reset count
            this.count = 0
        }, 500) // 250 ms
    }

    onChange(e) {
        const { value } = e.target
        this.setState({ value })
    }

    render() {
        const { value } = this.state

        return (
            <span onClick={this.handleClick}>
                {value}
            </span>
        )
    }
}

DoubleClickField.propTypes = {
    value: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired
}

export default DoubleClickField
