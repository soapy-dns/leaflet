import { combineReducers } from 'redux'
import current from './current'
import ui from './ui'
import tracks from './tracks'
import files from './files'


const reducers = combineReducers({
    current,
    ui,
    tracks,
    files
});

export default reducers
