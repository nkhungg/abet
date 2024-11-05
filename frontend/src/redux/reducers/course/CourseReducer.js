import { GET_COURSE_LIST, GET_DETAIL_COURSE, DETELE_COURSE, SHOW_EDIT_DETAIL_COURSE, EDIT_COURSE } from '../../types/index'

const stateDefault = {
    courseList: [],
    detailCourse: {},
    courseEdit: {
        id: "3",
        key: 3,
        name: "nhiph",
        groups: 1,
        description: "description",
        attrList: [],
    },
}



export const CourseReducer = (state = stateDefault, action) => {
    switch (action.type){
        case GET_COURSE_LIST: {
            state.courseList = action.payload
            return {...state};
        }
        case GET_DETAIL_COURSE: {
            state.detailCourse = action.payload
            return {...state};
        }
        case DETELE_COURSE: {
            state.courseList.filter(course => course.id === action.payload)
            return {...state}
        }
        
        case SHOW_EDIT_DETAIL_COURSE: {
            state.detailCourse = action.payload
            return {...state}
        }
        
        case EDIT_COURSE: {
            state.courseEdit = action.payload
            return {...state}
        }
        default : return {...state};
    }
}