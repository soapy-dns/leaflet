import React, {Component} from 'react'
import Collections from './collections/collections'

class TestContainer extends Component {
    constructor(props) {
        super(props)
    }

    doNothing(id) {
        console.log('doNothing')
    }

    render() {
        const collections = [
            {
                name: 'hitw',
                featureCollection: {
                    features: [
                        {
                            properties: {name: 'line1'},
                            geometry: {type: 'LineString'}
                        }
                    ]
                }
            }
        ]

        return (
            <Collections
                onSelectFile={this.doNothing}
                onSelectFeature={this.doNothing}
            />
        )

    }
}

export default TestContainer
