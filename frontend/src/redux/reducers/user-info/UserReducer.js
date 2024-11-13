import { SIGN_IN, SIGN_UP, GET_INFO_BY_ACCTOKEN, TRANSLATE_LANGUAGE } from '../../types/index'



let stateDefault = {
    lang: 'en',
    userLogin: null,
}



export const UserReducer = (state = stateDefault, action) => {
    switch (action.type) {
        case SIGN_IN:
            return { ...state, userLogin: action.payload }
     
        case SIGN_UP:
            return { ...state, userLogin: action.payload }

        case GET_INFO_BY_ACCTOKEN: 
            return { ...state, userLogin: action.payload }

        case TRANSLATE_LANGUAGE:
            return { ...state, lang: action.payload };

        default:
            return state
        }
}