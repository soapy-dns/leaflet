import React, {Component} from 'react'
import {Button, Icon, Menu, Label, Input} from 'semantic-ui-react'
import PropTypes from 'prop-types'

class Collections extends Component {
    constructor(props) {
        super(props)
        this.onSelectCollection = this.onSelectCollection.bind(this)

    }

    componentDidMount() {
        console.log('collections component did mount')
    }

    onSelectCollection (id) {
        console.log('onSelectCollection', onSelectCollection)
        const { onSelectCollection, collections } = this.props

        console.log('', collections[id])

        onSelectCollection(collections[id].name)
    }


    render() {
        const {collections} = this.props

        return (
            <div id="collections">
                <h1>Collections</h1>

                <Menu vertical borderless fluid className="collections top">
                    {collections.map((collection, id) => (
                        <Menu.Item key={id} onClick={(e) => this.onSelectCollection(id)}>
                            {collection.name}
                        </Menu.Item>
                    ))}
                </Menu>
                <div className="collections bottom">
                    <h1>this one</h1>
                </div>
            </div>
        )
    }
}

Collections.propTypes = {
    // dispatch: PropTypes.func,
    collections: PropTypes.object,
    selectedCollectionName: PropTypes.string,
    onSelectCollection: PropTypes.func
}
//
// function mapStateToProps(state) {
//     console.log('state', state)
//     return {
//         collections: state.featureCollections
//     }
// }

export default Collections
