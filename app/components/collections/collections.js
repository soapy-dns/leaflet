import React, {Component} from 'react'
import {Button, Menu, Label, Input} from 'semantic-ui-react'
import PropTypes from 'prop-types'
import { has } from 'lodash'
import { connect } from 'react-redux'

import Feature from './feature'
import Collection from './collection'
import { selectCollection } from '../../actions/ui'

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

    onMoveFeature(featureName, newCollectionName) {
        const { collections, ui, dispatch } = this.props
        console.log('onMoveFeature', featureName)

        // todo - put change in here on reducer
        // - here I think as reducer is just for adding into store.
        //Here we have access to data in reducer we'd have to pass data to it.
        //get feature from selectedCollectionName
        let selectedCollection = collections.find(it => it.name === ui.selectedCollectionName)
        const newCollection = collections.find(it => it.name === newCollectionName)

        console.log('selectedCollection', selectedCollection)
        console.log('newCollection', newCollection)
        const feature = selectedCollection.featureCollection.features.find(it => it.properties.name === featureName)
        console.log('feature', feature)

        //add feature its new collection
        newCollection.featureCollection.features.push(feature)

        //remove feature from selectedCollection
        selectedCollection = selectedCollection.featureCollection.features.filter(it => it.properties.name !== featureName)

        //change selectedCollectionName to new collection
        dispatch(selectCollection(newCollectionName))

        // dispatch something

    }

    render() {
        const {collections, ui, onSelectFeature} = this.props

        const selectedCollection = collections.find(it => it.name === ui.selectedCollectionName)

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

                <div className="side-panel-top">
                    <h1>Collections</h1>
                    <Menu vertical borderless fluid className="collections top">
                        {collections.map((collection, id) => (
                            <Menu.Item key={id} onClick={(e) => this.onSelectCollection(id)} >
                                <Collection collectionName={collection.name} selectedCollectionName={ui.selectedCollectionName} onMoveFeature={this.onMoveFeature} />
                            </Menu.Item>
                        ))}
                    </Menu>
                </div>

                {ui.selectedCollectionName ? (
                    <div>
                        <div className="side-panel-bottom">
                            <h1>{ui.selectedCollectionName}</h1>
                            <Menu vertical borderless fluid className="collections bottom">
                                {features.map((feature, id) => (
                                    <Menu.Item key={id} onClick={(e) => onSelectFeature(id)}>
                                        <Feature featureType={feature.type} featureName={feature.name} />
                                    </Menu.Item>
                                ))}
                            </Menu>
                        </div>
                    </div>
                ) : null}

            </div>
        )
    }
}

Collections.propTypes = {
    dispatch: PropTypes.func,
    // collections: PropTypes.object,
    // selectedCollectionName: PropTypes.string,
    onSelectCollection: PropTypes.func,
    onSelectFeature: PropTypes.func
}

function mapStateToProps(state) {
    return {
        ui: state.ui,
        collections: state.featureCollections
    }
}

export default connect(mapStateToProps)(Collections)

