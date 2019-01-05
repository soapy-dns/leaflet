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

    onRemoveFile(e, fileId) {
        console.log('collections -on remove file')
        e.stopPropagation()  // stops higher level events from firing
        console.log('Collections onRemoveFile', fileId)
        this.props.onRemoveFile(fileId)
    }

    onRemoveFeature(e, featureId) {
        e.stopPropagation()
        console.log('Collections onRemoveFeature', featureId)
        this.props.onRemoveFeature(featureId)
    }

    updateFileName() {
        alert('todo - update file name')
    }

    saveFile(fileName, fileId) {
        const {files} = this.props
        const element = document.createElement("a")
        const file = utils.getFileById(files, fileId)

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

    onSelectFile(fileId) {
        // console.log('Collections - onSelectFile', fileId)
        const {files} = this.props
        // console.log('files', files)

        this.props.onSelectFile(fileId)
    }

    onMoveFeature(draggedFeatureName, targetFileId) {
        const {files, ui, dispatch} = this.props
        const clonedFiles = cloneDeep(files)
        console.log('clonedFiles', clonedFiles)

        let sourceFile = clonedFiles.find(it => it.id === ui.selectedFileId)
        const targetFile = clonedFiles.find(it => it.id === targetFileId)

        const draggedFeature = sourceFile.featureCollection.features.find(it => it.properties.name === draggedFeatureName)

        //add feature its new collection
        targetFile.featureCollection.features.push(draggedFeature)
        targetFile.altered = true

        //remove feature from selectedCollection
        const sourceFeatures = sourceFile.featureCollection.features
        sourceFile.featureCollection.features = sourceFeatures.filter(it => it.properties.name !== draggedFeatureName)
        sourceFile.altered = true

        // update redux
        dispatch(selectFile(targetFileId, targetFile.id)) // todo will ultimately remove the name
        dispatch(updateFiles(clonedFiles))
    }

    render() {
        const {files, ui, onSelectFeature, onRemoveFile, onRemoveFeature} = this.props
        if (isEmpty(files)) return null

        const selectedFile = files.find(it => it.id === ui.selectedFileId)

        const features = []
        if (selectedFile && has(selectedFile, 'featureCollection')) {
            selectedFile.featureCollection.features.map(feature => {
                features.push({
                    name: feature.properties.name,
                    type: feature.geometry.type,
                    id: feature.properties.id
                })
            })
        }
        // files.forEach(it => console.log('fileId', it.id))

        return (
            <div id="collections" className={ui.showFileSlider ? "open" : null}>
                <button className="hamburger" onClick={this.toggleVisibility}>
                    <span>Files & Features</span>
                </button>

                <div className="side-panel-top">
                    <h3>Files</h3>
                    <Menu vertical borderless fluid className="collections top">
                        {files.map((file) => (
                            <Menu.Item key={file.id} onClick={(e) => this.onSelectFile(file.id)}>
                                <Collection
                                    fileId={file.id}
                                    fileName={file.name}
                                    altered={file.altered}
                                    selectedFileId={ui.selectedFileId}
                                    onMoveFeature={this.onMoveFeature}
                                    onSaveFile={this.saveFile}
                                    onRemoveFile={this.onRemoveFile}
                                    updateFileName={this.updateFileName}
                                />
                                <Icon name="delete" color="red" size="large"
                                      onClick={(e) => this.onRemoveFile(e, file.id)}/>
                            </Menu.Item>
                        ))}
                    </Menu>
                </div>

                {ui.selectedFileId ? (
                    <div>
                        <div className="side-panel-bottom">
                            <h3>Features</h3>
                            <Menu vertical borderless fluid className="collections bottom">
                                {features.map((feature, id) => (
                                    <Menu.Item key={id} onClick={(e) => onSelectFeature(id)}>
                                        <Feature
                                            featureType={feature.type}
                                            featureName={feature.name}
                                        />
                                        <Icon name="delete" color="red" size="large"
                                              onClick={(e) => this.onRemoveFeature(e, feature.id)}/>
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
    // console.log('state.ui', state.ui)
    return {
        ui: state.ui,
        files: state.files
    }
}

export default connect(mapStateToProps)(Collections)

