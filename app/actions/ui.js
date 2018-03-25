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

export const SELECT_COLLECTION = 'ui/SELECT_COLLECTIONS'
export const selectCollection = collectionName => ({
    type: SELECT_COLLECTION,
    selectedCollectionName: collectionName
})

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
export const TOGGLE_COLLECTION_SLIDER = 'ui/TOGGLE_COLLECTION_SLIDER'
export const toggleCollectionSlider = (boolean) => ({
    type: TOGGLE_COLLECTION_SLIDER,
    showCollectionSlider: boolean
})
