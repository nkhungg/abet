import { DISPLAY_LOADING } from '../../types/index'

const stateDefault = {
    lecturerList: []
}



export const LecturerReducer = (state = stateDefault,acttion) => {
    switch (acttion.type){
        case DISPLAY_LOADING:{
            state.isLoading = true;
            return {...state};
        }
  
        default : return {...state};
    }
}