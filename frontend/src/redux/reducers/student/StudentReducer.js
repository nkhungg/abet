import { GET_STUDENT_LIST } from '../../types/index'

const stateDefault = {
    studentList: []
}



export const StudentReducer = (state = stateDefault,acttion) => {
    switch (acttion.type){
        case GET_STUDENT_LIST: {
            state.studentList = acttion.payload 
            return {...state};
        }

        default : return {...state};
    }
}