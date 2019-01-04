import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { Input } from 'semantic-ui-react'


class ChangeableField extends Component {
    constructor(props) {
        super(props)
        this.state = {
            edit: false,
            value: props.value
        }
        this.handleClick = this.handleClick.bind(this)
        this.handleBlur = this.handleBlur.bind(this)
    }

    handleClick(e) {
        // console.log('handleClick')
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
        }, 250) // 250 ms
    }

    handleBlur (e) {
        // TODO - handle saving here
        console.log('handleBlur')

        // close edit mode
        this.setState({
          edit: false
        })
      }


    // todo - have updateable field component so can re-use
    render() {
        const { edit, value } = this.state
        // console.log('--------------------------------')
        // console.log('value', value)
        // console.log('--------------------------------')

        if (edit) {
            return (
                <span>
                    <span><Input name="collectionName" onBlur={this.handleBlur} value={value} /></span>
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
    value: PropTypes.string
}

export default ChangeableField
