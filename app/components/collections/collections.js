import React, {Component} from 'react'
import {Button, Icon, Menu, Label, Input} from 'semantic-ui-react'
import PropTypes from 'prop-types'

const _getFeatureHtml = (feature) => {
    switch (feature.type) {
        case 'Point':
            return (<span><Icon color="blue" size="large" name='marker'/>{feature.name}</span>)
        case 'LineString':
            return (<span><Icon color="blue" size="large" name='compass'/>{feature.name}</span>)
        default:
            return null
       }
}

class Collections extends Component {
    constructor(props) {
        super(props)

        this.toggleVisibility = this.toggleVisibility.bind(this)
        this.state = {
            visible: false,
            activeItem: null,
        }
        this.onSelectCollection = this.onSelectCollection.bind(this)

    }

    toggleVisibility() {
        console.log('toggle visibility')
        this.setState({visible: !this.state.visible})
    }

    componentDidMount() {
        console.log('collections component did mount')
    }

    onSelectCollection(id) {
        console.log('onSelectCollection', onSelectCollection)
        const {onSelectCollection, collections} = this.props

        console.log('', collections[id])

        onSelectCollection(collections[id].name)
    }


    render() {
        const {collections, selectedCollectionName, onSelectFeature} = this.props

        // if ()

        const selectedCollection = collections.find(it => it.name === selectedCollectionName)
        console.log('selectedCollection--', selectedCollection)
        const features = []
        if (selectedCollection && selectedCollection.featureCollection) {
            // console.log('selectedCollection.featureCollection', selectedCollection.featureCollection)
            console.log('count', selectedCollection.featureCollection.features.length)
            selectedCollection.featureCollection.features.map(feature => {
                console.log('feature', feature)
                features.push({
                    name: feature.properties.name,
                    type: feature.geometry.type
                })
            })
        }

        console.log('features', features)

        return (
            <div id="collections" className={this.state.visible ? "open" : null}>
                <button className="hamburger" onClick={this.toggleVisibility}>
                    <span>Collections</span>
                </button>
                <h1>Collections</h1>

                <Menu vertical borderless fluid className="collections top">
                    {collections.map((collection, id) => (
                        <Menu.Item key={id} onClick={(e) => this.onSelectCollection(id)} >
                            {<span><Icon color="blue" size="large" name='folder outline'/>{collection.name}</span>}
                        </Menu.Item>
                    ))}
                </Menu>
                {selectedCollectionName ? (
                    <div>
                        <h1>{selectedCollectionName}</h1>
                        <Menu vertical borderless fluid className="collections bottom">
                            {features.map((feature, id) => (
                                <Menu.Item key={id} onClick={(e) => onSelectFeature(id)}>
                                    {_getFeatureHtml(feature)}
                                </Menu.Item>
                            ))}
                        </Menu>
                    </div>


                ) : null}

            </div>
        )
    }
}


Collections.propTypes = {
    // dispatch: PropTypes.func,
    collections: PropTypes.object,
    selectedCollectionName: PropTypes.string,
    onSelectCollection: PropTypes.func,
    onSelectFeature: PropTypes.func

}
//
// function mapStateToProps(state) {
//     console.log('state', state)
//     return {
//         collections: state.featureCollections
//     }
// }

export default Collections
