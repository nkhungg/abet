import { SET_SELECTED_SIDEBAR } from '../../types/index'

const stateDefault = {
    selectedKey: 1,
}


export const SidebarReducer = (state = stateDefault, action) => {
    switch (action.type){
        case SET_SELECTED_SIDEBAR:{
            state.selectedKey = 2
            return {...state};
        }

        default : return {...state};
    }
}