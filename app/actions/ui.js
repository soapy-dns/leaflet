export const DRAW_LINE_ACTION = 'ui/DRAW_LINE_ACTION'

export const drawLineAction = () => ({
    type: DRAW_LINE_ACTION
})


export const TOGGLE_ELEVATION = 'ui/TOGGLE_ELEVATION'
export const toggleElevation = (boolean) => {
    return{
        type: TOGGLE_ELEVATION,
        boolean
    }
}

// todo remove selectedFileName
export const SELECT_FILE = 'ui/SELECT_FILES'
export const selectFile = (fileName, fileId) => ({
    type: SELECT_FILE,
    selectedFileName: fileName,
    selectedFileId: fileId
})

// export const UNSELECT_FILE = 'ui/UNSELECT_FILES'
// export const unselectFile = fileName => ({
//     type: SELECT_FILE,
//     selectedFileName: null
// })

export const SELECT_LATLNG = 'ui/SELECT_LATLNG'
export const selectLatLng = (lat, lng) => ({
    type: SELECT_LATLNG,
    selectedLatitude: lat,
    selectedLongitude: lng
})

// todo - change name
// clear the selected lat long
export const CLEAR_LATLNG = 'ui/CLEAR_LATLNG'
export const clearLatLng = () => ({
    type: CLEAR_LATLNG,
    selectedLatitude: undefined,
    selectedLongitude: undefined
})

// toggle collection slider
export const TOGGLE_FILE_SLIDER = 'ui/TOGGLE_FILE_SLIDER'
export const toggleFileSlider = (boolean) => ({
    type: TOGGLE_FILE_SLIDER,
    showFileSlider: boolean
})

export const SHOW_DRAWING_MENU = 'ui/SHOW_DRAWING_MENU'
export const showDrawingMenu = () => ({
    type: SHOW_DRAWING_MENU
})

export const SHOW_MAIN_MENU = 'ui/SHOW_MAIN_MENU'
export const showMainMenu = () => ({
    type: SHOW_MAIN_MENU
})

export const SELECT_LINE = 'ui/SELECT_LINE'
export const selectLine = (selectedLineId) => ({
    type: SELECT_LINE,
    selectedLineId
})

export const UNSELECT_LINE = 'ui/UNSELECT_LINE'
export const unselectLine = () => ({
    type: UNSELECT_LINE
})
