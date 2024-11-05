// setup Redux
import { applyMiddleware, combineReducers, createStore } from "redux";
import reduxThunk from "redux-thunk";
import { LoadingReducer } from './reducers/common/LoadingReducer.js'
import { SidebarReducer } from './reducers/common/SidebarReducer'

import { UserReducer } from './reducers/user-info/UserReducer'
import { StudentReducer } from './reducers/student/StudentReducer'
import { LecturerReducer } from './reducers/lecturer/LecturerReducer'
import { SubjectReducer } from './reducers/subject/SubjectReducer'
import { CourseReducer } from './reducers/course/CourseReducer'
import { DrawerCourseReducer } from './reducers/course/DrawerCourseReducer'
import { AttributeReducer } from './reducers/ad-attribute/AttributeReducer'
import { GeneralProgramReducer } from './reducers/program/GeneralProgramReducer'

const rootReducer = combineReducers({
    // page
    UserReducer,
    StudentReducer,
    LecturerReducer,
    SubjectReducer,
    CourseReducer,
    DrawerCourseReducer,
    AttributeReducer,
    GeneralProgramReducer,
    

    // common
    LoadingReducer,
    SidebarReducer,
   
})

export const store = createStore(rootReducer,applyMiddleware(reduxThunk));