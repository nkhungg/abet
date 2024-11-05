import { HIDE_LOADING, DISPLAY_LOADING } from '../../types/index';

const stateDefault = {
    isLoading: false,
};

export const LoadingReducer = (state = stateDefault, action) => {
    switch (action.type) {
        case HIDE_LOADING:
            state.isLoading = false;
            return { ...state };

        case DISPLAY_LOADING:
            state.isLoading = true;
            return { ...state };

        default:
            return state;
    }
};