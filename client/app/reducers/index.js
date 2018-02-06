import { combineReducers } from 'redux'
import currentLayer from './current-layer'
import ui from './ui'
import tracks from './tracks'


const reducers = combineReducers({
    currentLayer,
    ui,
    tracks
});

export default reducers
