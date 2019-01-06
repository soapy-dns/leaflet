import React, {Component} from 'react'
import PropTypes from 'prop-types'


class ChangeableField extends Component {
    constructor(props) {
        super(props)
        this.state = {
            edit: false,
            value: props.value
        }
        this.handleClick = this.handleClick.bind(this)
        this.handleBlur = this.handleBlur.bind(this)
        this.onChange = this.onChange.bind(this)
    }

    handleClick(e) {
        // cancel previous callback
        if (this.timeout) clearTimeout(this.timeout)

        // increment count
        this.count++

        // schedule new callback  [timeBetweenClicks] ms after last click
        this.timeout = setTimeout(() => {
            // listen for double clicks
            if (this.count === 2) {
                // turn on edit mode
                this.setState({
                    edit: true,
                })
            }

            // reset count
            this.count = 0
        }, 500) // 250 ms
    }

    onChange(e) {
        const { value } = e.target
        this.setState({ value })
    }

    handleBlur (e) {
        // save
        this.props.onSave(this.state.value)

        // close edit mode
        this.setState({
          edit: false
        })
      }


    // todo - have updateable field component so can re-use
    render() {
        const { edit, value } = this.state

        if (edit) {
            // make input take focus when rendered with autoFocus
            return (
                <span>
                    <input  className="leaflet-input" name="collectionName" onBlur={this.handleBlur} value={value} autoFocus onChange={this.onChange} />
                </span>

            )
        } else {
            return (
                <span onClick={this.handleClick}>
                    {value}
                </span>
            )
        }
    }
}

ChangeableField.propTypes = {
    value: PropTypes.string.isRequired,
    onSave: PropTypes.func.isRequired
}

export default ChangeableField
