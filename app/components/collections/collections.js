import React, {Component} from 'react'
import {Button, Menu, Label, Input} from 'semantic-ui-react'
import PropTypes from 'prop-types'
import { has } from 'lodash'

import Feature from './feature'
import Collection from './collection'

class Collections extends Component {
    constructor(props) {
        super(props)

        this.toggleVisibility = this.toggleVisibility.bind(this)
        this.state = {
            visible: false,
            activeItem: null,
        }
        this.onSelectCollection = this.onSelectCollection.bind(this)
        this.onMoveFeature = this.onMoveFeature.bind(this)
    }

    toggleVisibility() {
        console.log('toggle visibility')
        this.setState({visible: !this.state.visible})
    }

    componentDidMount() {
        console.log('collections component did mount')
    }

    onSelectCollection(id) {
        const { collections } = this.props

        this.props.onSelectCollection(collections[id].name)
    }

    onMoveFeature() {
        console.log('onMoveFeature')
    }

    render() {
        const {collections, selectedCollectionName, onSelectFeature} = this.props

        const selectedCollection = collections.find(it => it.name === selectedCollectionName)

        const features = []
        if (has(selectedCollection, 'featureCollection')) {
            selectedCollection.featureCollection.features.map(feature => {
                features.push({
                    name: feature.properties.name,
                    type: feature.geometry.type
                })
            })
        }

        return (
            <div id="collections" className={this.state.visible ? "open" : null}>
                <button className="hamburger" onClick={this.toggleVisibility}>
                    <span>Collections</span>
                </button>
                <h1>Collections</h1>

                <Menu vertical borderless fluid className="collections top">
                    {collections.map((collection, id) => (
                        <Menu.Item key={id} onClick={(e) => this.onSelectCollection(id)} >
                            <Collection collectionName={collection.name} selectedCollectionName={selectedCollectionName} onMoveFeature={this.onMoveFeature} />
                        </Menu.Item>
                    ))}
                </Menu>

                {selectedCollectionName ? (
                    <div>
                        <h1>{selectedCollectionName}</h1>
                        <Menu vertical borderless fluid className="collections bottom">
                            {features.map((feature, id) => (
                                <Menu.Item key={id} onClick={(e) => onSelectFeature(id)}>
                                    <Feature featureType={feature.type} featureName={feature.name} />
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
    collections: PropTypes.object,
    selectedCollectionName: PropTypes.string,
    onSelectCollection: PropTypes.func,
    onSelectFeature: PropTypes.func

}

export default Collections
