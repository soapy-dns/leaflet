export const DRAW_LINE_ACTION = 'ui/DRAW_LINE_ACTION'

export const drawLineAction = () => ({
    type: DRAW_LINE_ACTION
})


export const TOGGLE_ELEVATION = 'TOGGLE_ELEVATION'
export const toggleElevation = (boolean) => ({
    type: TOGGLE_ELEVATION,
    boolean
})
