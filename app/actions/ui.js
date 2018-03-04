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
export const selectCollection = collection => ({
    type: SELECT_COLLECTION,
    selectedCollectionName: collection.name
})
