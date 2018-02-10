import React, {Component} from 'react'
import {Sidebar, Segment, Button, Menu, Image, Icon, Header} from 'semantic-ui-react'

class SidebarLeftOverlay extends Component {
    constructor(props) {
        super(props)
        this.toggleVisibility = this.toggleVisibility.bind(this)
        this.state = {
            visible: false
        }
    }

    toggleVisibility() {
        console.log('toggle visibility')
        this.setState({visible: !this.state.visible})
    }

    render() {
        // const { visible } = this.state

        return (
            <div>
                <Button basic onClick={this.toggleVisibility} >
                    <Icon name='content'/>
                </Button>
                <Sidebar.Pushable as={Segment} className="front-layer">

                    <Sidebar as={Menu} animation='overlay' width='thin' visible={this.state.visible} icon='labeled'
                             vertical inverted className="front-layer">
                        <Menu.Item name='locate'>
                            Locate
                        </Menu.Item>
                        <Menu.Item name='openTrack'>
                            Open track
                        </Menu.Item>
                        <Menu.Item name='saveGPX'>
                            Save as GPX
                        </Menu.Item>
                    </Sidebar>
                    <Sidebar.Pusher>
                        <Segment basic>


                        </Segment>
                    </Sidebar.Pusher>
                </Sidebar.Pushable>
            </div>
        )
    }
}

export default SidebarLeftOverlay