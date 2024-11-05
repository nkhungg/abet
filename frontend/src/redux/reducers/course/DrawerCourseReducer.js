import React from 'react'
import { OPEN_FORM_COURSE_DRAWER, CLOSE_FORM_COURSE_DRAWER, ADD_INFO_COURSE_DRAWER } from '../../types/index'

const initialState = {
    visible: false,
    title:'',
    width: 450,
    ComponentContentDrawer: <p>default body drawer</p>,
}

export const DrawerCourseReducer = (state = initialState, action) => {
    switch (action.type) {

        case OPEN_FORM_COURSE_DRAWER:
            return { ...state, visible: true }
        case CLOSE_FORM_COURSE_DRAWER:
            return { ...state, visible: false }
        case ADD_INFO_COURSE_DRAWER: 
            state.visible = true;
            state.ComponentContentDrawer = action.Component;
            state.title = action.title;
            if(action.width) {
                state.width = action.width;
            } else {
                state.width = 450
            }
            return { ...state }
        default:
            return {...state}
    }
}
