import { GET_ALL_ATTRIBUTE } from '../../types/index'

const stateDefault = {
    atrrList: [],
}



export const AttributeReducer = (state = stateDefault, action) => {
    switch (action.type){

        case GET_ALL_ATTRIBUTE: {
            state.atrrList = action.payload
            return {...state}
        }
        
        default : return {...state};
    }
}