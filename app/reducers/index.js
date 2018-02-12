import { combineReducers } from 'redux'
import current from './current'
import ui from './ui'
import tracks from './tracks'


const reducers = combineReducers({
    current,
    ui,
    tracks
});

export default reducers
