import { SAVE_TRACK, SELECT_TRACK } from '../actions/tracks'
import { getLine } from '../utils/index'

export default function (trackState = [], action) {
    switch (action.type) {
        case SAVE_TRACK:
            trackState.map(it => it.selected = false)
            const obj = { track: action.track, selected: true }
            trackState.push(obj)
            return trackState

        case SELECT_TRACK:
            console.log('trackState', trackState)

            // set all tracks to unselected
            trackState.map(it => it.selected = false)

            // todo change naming - track isn't just track,  it has a selected flag.  Then even in that the real track has feetures
            //trackObj, trackFeatures (no)
            // basecamp has collection, list
            const line = getLine(action.track)
            const selectedTrack = trackState.find(it => {
                const track = it.track
                const matchingFeature = track.features.find(it => {
                    return it.properties.name === line.properties.name
                })
                return !!matchingFeature
            })
            selectedTrack.selected = true
            return trackState

        default:
            return trackState
    }
}
