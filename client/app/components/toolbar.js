import React, { Component } from 'react'
import { Button, Icon, Menu, Label, Input } from 'semantic-ui-react'
import PropTypes from 'prop-types';

class Toolbar extends Component {
    constructor(props) {
        super(props)

        this.toggleVisibility = this.toggleVisibility.bind(this)
        this.state = {
            visible: false,
            activeItem: null
        }
    }

    componentDidMount() {
        console.log('search component did mount')
    }

    toggleVisibility() {
        console.log('toggle visibility')
        this.setState({visible: !this.state.visible})
    }

    render() {
        const { activeItem } = this.state
        const { locate } = this.props

        return (
            <div id="toolbar" className={this.state.visible ? "open" : null}>
                <button className="hamburger" onClick={this.toggleVisibility}>
                    <span>Menu</span>
                </button>
                <div id="menu">
                    <h2>Controls</h2>
                    <Menu vertical>
                        <Menu.Item name='inbox' active={activeItem === 'inbox'} onClick={locate}>
                            <Label color='teal'>1</Label>
                            Locate
                        </Menu.Item>

                        <Menu.Item name='spam' active={activeItem === 'spam'} onClick={this.toggleVisibility}>
                            <Label>51</Label>
                            Spam
                        </Menu.Item>

                        <Menu.Item name='updates' active={activeItem === 'updates'} onClick={this.toggleVisibility}>
                            <Label>1</Label>
                            Updates
                        </Menu.Item>
                        <Menu.Item>
                            <Input icon='search' placeholder='Search mail...' />
                        </Menu.Item>
                    </Menu>
                    <ul>
                        <li>Open track</li>
                        <li>Save as GPX</li>
                        <li>Save as KML</li>
                        <li>Draw track</li>
                        <li>Edit track</li>
                        <li>Show track details</li>
                        <li>Choose map source</li>
                    </ul>
                </div>
            </div>
        )
    }
}

Toolbar.propTypes = {
    locate: PropTypes.func,
    okAction: PropTypes.func,
    cancelAction: PropTypes.func
};

export default Toolbar;
