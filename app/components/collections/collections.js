import React, {Component} from 'react'
import {Menu, Icon} from 'semantic-ui-react'

import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {cloneDeep, has, isEmpty} from 'lodash'

import Feature from './feature'
import Collection from './collection'
import {selectFile, toggleFileSlider} from '../../actions/ui'
import {updateFiles, markFileAsSaved} from '../../actions/files'
import utils from '../../common/utils'

class Collections extends Component {
    constructor(props) {
        super(props)

        this.toggleVisibility = this.toggleVisibility.bind(this)
        this.saveFile = this.saveFile.bind(this)
        this.state = {
            activeItem: null,
        }
        this.onSelectFile = this.onSelectFile.bind(this)
        this.onMoveFeature = this.onMoveFeature.bind(this)
        this.onRemoveFile = this.onRemoveFile.bind(this)
    }

    onRemoveFile(e, fileName) {
        e.stopPropagation()  // stops higher level events from firing
        console.log('Collections onRemoveFile', fileName)
        this.props.onRemoveFile(fileName)
    }

    onRemoveFeature(e, featureName) {
        e.stopPropagation()
        console.log('Collections onRemoveFeature', featureName)
    }

    saveFile(fileName) {
        const {files} = this.props
        const element = document.createElement("a")
        const file = utils.getFileByName(files, fileName)

        const blob = new Blob([JSON.stringify(file.featureCollection)], {type: 'application/json'})

        element.href = URL.createObjectURL(blob)
        element.download = `${fileName}`

        element.click()

        file.altered = false  // possibly shouldn't be updating this.  saving it via dispatch anyway
        dispatch(markFileAsSaved(file))

    }

    toggleVisibility() {
        const {dispatch, ui} = this.props
        console.log('toggle visibility', ui.showFileSlider)

        dispatch(toggleFileSlider(!ui.showFileSlider))
    }

    componentDidMount() {
        console.log('collections component did mount')
    }

    onSelectFile(id) {
        console.log('Collections - onSelectFile')
        const {files} = this.props

        this.props.onSelectFile(files[id].name)
    }

    onMoveFeature(draggedFeatureName, targetFileName) {
        const {collections, ui, dispatch} = this.props
        const clonedConnections = cloneDeep(collections)

        let sourceCollection = clonedConnections.find(it => it.name === ui.selectedFileName)
        const targetCollection = clonedConnections.find(it => it.name === targetFileName)

        const draggedFeature = sourceCollection.featureCollection.features.find(it => it.properties.name === draggedFeatureName)

        //add feature its new collection
        targetCollection.featureCollection.features.push(draggedFeature)
        targetCollection.altered = true

        //remove feature from selectedCollection
        const sourceFeatures = sourceCollection.featureCollection.features
        sourceCollection.featureCollection.features = sourceFeatures.filter(it => it.properties.name !== draggedFeatureName)
        sourceCollection.altered = true

        // update redux
        dispatch(selectFile(targetFileName))
        dispatch(updateFiles(clonedConnections))
    }

    render() {
        const {files, ui, onSelectFeature, onRemoveFile, onRemoveFeature} = this.props
        console.log('files', files)
        if (isEmpty(files)) return null

        const selectedFile = files.find(it => it.name === ui.selectedFileName)

        console.log('selectedFile', selectedFile)
        const features = []
        if (selectedFile && has(selectedFile, 'featureCollection')) {
            selectedFile.featureCollection.features.map(feature => {
                features.push({
                    name: feature.properties.name,
                    type: feature.geometry.type
                })
            })
        }

        return (
            <div id="collections" className={ui.showFileSlider ? "open" : null}>
                <button className="hamburger" onClick={this.toggleVisibility}>
                    <span>Collections</span>
                </button>

                <div className="side-panel-top">
                    <h3>Files</h3>
                    <Menu vertical borderless fluid className="collections top">
                        {files.map((file, id) => (
                            <Menu.Item key={id} onClick={(e) => this.onSelectFile(id)}>
                                <Collection
                                    fileName={file.name}
                                    altered={file.altered}
                                    selectedFileName={ui.selectedFileName}
                                    onMoveFeature={this.onMoveFeature}
                                    onSaveFile={this.saveFile}
                                    onRemoveFile={this.onRemoveFile}
                                />
                                <Icon name="delete" color="red" size="large"
                                      onClick={(e) => this.onRemoveFile(e, file.name)}/>
                            </Menu.Item>
                        ))}
                    </Menu>
                </div>

                {ui.selectedFileName ? (
                    <div>
                        <div className="side-panel-bottom">
                            <h3>Features</h3>
                            <Menu vertical borderless fluid className="collections bottom">
                                {features.map((feature, id) => (
                                    <Menu.Item key={id} onClick={(e) => onSelectFeature(id)}>
                                        <Feature featureType={feature.type} featureName={feature.name}/>
                                        <Icon name="delete" color="red" size="large"
                                              onClick={(e) => this.onRemoveFeature(e, feature.name)}/>
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
    ui: PropTypes.object,
    files: PropTypes.object,
    onSelectFile: PropTypes.func,
    onSelectFeature: PropTypes.func,
    onRemoveFile: PropTypes.func,
    onRemoveFeature: PropTypes.func
}

function mapStateToProps(state) {
    console.log('state.ui', state.ui)
    return {
        ui: state.ui,
        files: state.files
    }
}

export default connect(mapStateToProps)(Collections)

