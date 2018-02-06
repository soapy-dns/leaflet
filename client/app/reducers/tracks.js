import { SAVE_TRACK } from '../actions/tracks'

export default function (trackState = [], action) {
    switch (action.type) {
        case SAVE_TRACK:
            console.log('trackState', trackState)
            trackState.map(it => it.selected = false)
            console.log('SAVE_TRACK track', action.track)
            const obj = { track: action.track, selected: true }
            console.log(`obj ${obj}`)
            trackState.push(obj)
            return trackState

        default:
            return trackState
    }
}
