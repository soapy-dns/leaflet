/*
 A BRAND NEW FILE.  AS IT ISN'T ON THE FILE SYSTEM THE SAVE ICON SHOULD APPEAR
 EG ACTION WHEN ADDING A WAYPOINT
 */
export const NEW_FILE = 'file/NEW_FILE'
export const newFile = (fileText, fileName) => ({
    type: NEW_FILE,
    fileText,
    fileName
})

/*
 ADD FILE RESULTS IN A NEW FILE BEING LOADED -
 AS IT HAS NOT CHANGED THE SAVE ICON SHOULD NOT APPEAR
 */
export const ADD_FILE = 'file/ADD_FILE'
export const addFile = (fileText, fileName, fileId) => ({
    type: ADD_FILE,
    fileText,
    fileName,
    fileId
})
/*
 add feature to feature collection - should perhaps change the name
 */
export const ADD_FEATURE_TO_FILE = 'file/ADD_FEATURE_TO_FILE'
export const addFeatureToFile = (feature, selectedFileId) => ({
    type: ADD_FEATURE_TO_FILE,
    feature,
    selectedFileId
})

export const MOVE_FEATURE_AND_OPEN = 'file/MOVE_FEATURE_AND_OPEN'
export const moveFeatureAndOpen = (feature, selectedFileId) => {
    // do stuff
}

export const UPDATE_FILES = 'file/UPDATE_FILES'
export const updateFiles = (files) => ({
    type: UPDATE_FILES,
    files: files,
})

export const UPDATE_FILE = 'file/UPDATE_FILE'
export const updateFile = (file) => ({
    type: UPDATE_FILE,
    file
})

export const MARK_FILE_AS_ALTERED = 'file/MARK_FILE_AS_ALTERED'
export const markFileAsAltered = (fileId) => ({
    type: UPDATE_FILE,
    fileId
})

export const REMOVE_FILE = 'file/REMOVE_FILE'
export const removeFileFromStore = (fileId) => {
    console.log('removeFileFromStore action', fileId)
    return {
        type: REMOVE_FILE,
        fileId
    }
}

export const MARK_FILE_AS_SAVED = 'file/MARK_FILE_AS_SAVED'
export const markFileAsSaved = file => ({
    type: MARK_FILE_AS_SAVED,
    collection: file
})

// TODO - wip
export const UPDATE_WAYPOINT_POSITION = 'file/UPDATE_WAYPOINT_POSITION'
export const updateWaypointPosition = (fileName, pointId, latlng) => ({
    type: UPDATE_WAYPOINT_POSITION,
    fileName,
    pointId,
    latlng
})
