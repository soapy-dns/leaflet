
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
        this.onIdentify = this.onIdentify.bind(this)
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

    async onIdentify() {
        console.log('identify')
        const canvas = document.getElementById('canvas')
        const context = canvas.getContext('2d')

        // var data = context.getImageData(0, 0, canvas.width, canvas.height).data
        const data = {
            imgData64: canvas.toDataURL() // defaults to png
        }

        const { data: prediction } = await Api.identifyFace(data)
        context.beginPath()

        console.log('pred', prediction)
        console.log('result', prediction.className, prediction.distance)
        context.font = "20px Arial"
        context.fillStyle="#ff0000"

        context.fillText(prediction.className, prediction.facePosition.x + 15, prediction.facePosition.y + 15)
        context.lineWidth="4"
        context.strokeStyle="green"

        context.rect(prediction.facePosition.x, prediction.facePosition.y, prediction.facePosition.width, prediction.facePosition.height)

        context.stroke()
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
                                    <Button id="retry" onClick={this.onRetry} negative>Retry</Button>
                                    <Button id="train" onClick={this.onTrain} primary>Train</Button>
                                    <Button id="identify" onClick={this.onIdentify} primary>Identify face</Button>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>

        )
        // return (
        //     <Container>
        //         <br/>
        //         <Grid columns={2}>
        //             <Grid.Row>
        //                 <Grid.Column>
        //                     <div class="video-container">
        //                         <video id="player" width="320" height="240" controls></video>
        //                     </div>

        //                 </Grid.Column>
        //                 <Grid.Column>

        //                 </Grid.Column>
        //             </Grid.Row>
        //         </Grid>
        //     </Container>
        // )
    }
}

Face.propTypes = {
    map: PropTypes.object.isRequired,
}

export default Face
