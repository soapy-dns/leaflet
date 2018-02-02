import { SAVE_TRACK } from '../actions/current-layer'

export default function (currentLayerState = {}, action) {
    switch (action.type) {
        case SAVE_TRACK:
            return action.track

        default:
            return {}
    }
}
