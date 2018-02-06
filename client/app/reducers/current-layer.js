import { SAVE_TRACK } from '../actions/current-layer'

const merge = (currentLayerState, thing) => Object.assign({}, currentLayerState, thing)

export default function (currentLayerState = {}, action) {
    switch (action.type) {
        case SAVE_TRACK:
            // return merge(currentLayerState, action.track)
            return action.track

        default:
            return currentLayerState
    }
}
