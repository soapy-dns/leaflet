
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Api from '../../utils/api'
import { Grid, Container, Button, Input } from 'semantic-ui-react'
import '../../styles/face-styles.css'



// let context

class Face extends Component {
    constructor(props) {
        super(props)
        this.state = {
            imageCaptured: false,
            data: {}
        }
        this.onCapture = this.onCapture.bind(this)
        this.onLoad = this.onLoad.bind(this)
        this.onRetry = this.onRetry.bind(this)
        this.onTrain = this.onTrain.bind(this)
        this.changeValue = this.changeValue.bind(this)
    }

    componentDidMount() {
        console.log('face component did mount')
        const player = document.getElementById('player')

        // const captureButton = document.getElementById('capture')

        const constraints = {
            video: true,
        }

        // Attach the video stream to the video element and autoplay.
        navigator.mediaDevices.getUserMedia(constraints)
            .then((stream) => {
                player.srcObject = stream
            })
    }

    /**
    * change the stored value
    *
    * @param object event
    */
    changeValue(event) {
        const { data } = this.state
        const { name, value } = event.target
        data[name] = value
        this.setState({ data })
    }

    onCapture() {
        this.setState({ imageCaptured: true })
        const canvas = document.getElementById('canvas')
        canvas.width = 640 // trying to make the pixel with equal css width
        canvas.height = 480
        const context = canvas.getContext('2d')

        // Draw the video frame to the canvas.
        context.drawImage(player, 0, 0, canvas.width, canvas.height)

        // Stop all video streams.
        player.srcObject.getVideoTracks().forEach(track => track.stop())
    }

    onCancel() {

    }

    async onLoad() {
        const canvas = document.getElementById('canvas')
        const context = canvas.getContext('2d')

        const data = {
            imgData64: canvas.toDataURL() // defaults to png
        }

        await Api.postLearningImage(data, this.state.data.label)

    }

    onRetry() {
        // clear canvas

        // restart media
        const constraints = {
            video: true,
        }
        // Attach the video stream to the video element and autoplay.
        navigator.mediaDevices.getUserMedia(constraints)
            .then((stream) => {
                player.srcObject = stream
            })

        // mark as image not captured
        this.setState({ imageCaptured: false })
    }



    async onTrain() {
        console.log('train')
        await Api.train()
    }

    /**
     * https://developer.mozilla.org/en-US/docs/Web/API/ImageCapture
     * ImageCapture might help, but experimental at the moment
     */
    render() {
        return (
            <div class="container">
                {!this.state.imageCaptured ?
                (
                    <div>
                        <video id="player" autoPlay playsinline muted ></video>
                        <div>
                            <Button id="capture" onClick={this.onCapture} positive>Capture</Button>
                        </div>
                        <div>
                            Or
                        </div>
                        <div>
                            Load from file
                        </div>
                    </div>
                ) : (
                    null
                )}


                <div class="m-t-1">
                    <canvas id="canvas" className={this.state.imageCaptured? "canvas-container" : "canvas-container hidden"}></canvas>
                    {this.state.imageCaptured ? (
                        <div>
                            <div class="m-t-1">
                                <Input focus placeholder='face label...' name='label' onChange={this.changeValue} />
                                &nbsp;
                                <Button id="load" onClick={this.onLoad} primary>Load face for training</Button>
                                <div class="m-t-1">
                                    <Button id="retry" onClick={this.onRetry} basic primary>Cancel</Button>
                                    <Button id="train" onClick={this.onTrain} primary>Train</Button>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>

        )
    }
}

Face.propTypes = {
    map: PropTypes.object.isRequired,
}

export default Face
