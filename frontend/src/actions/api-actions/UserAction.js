import { ACCESSTOKEN } from "../../util/SettingSystem";
import { userService } from "../../services/UserService";
import { GET_INFO_BY_ACCTOKEN, SIGN_IN } from "../../redux/types/index";
import {history} from '../../App';
import { notifiFunction } from "../../util/notification/Notification";

export const signInActionApi = (data) => {
  return async (dispatch) => {
    try {
      let result = await userService.signIn(data);
      if (result && result.data && result.data.currentUser) {
        localStorage.setItem(ACCESSTOKEN, result.data.accessToken);
        dispatch({
          type: SIGN_IN,
          payload: result.data.currentUser,
        });
        history.replace('/general-program');
      } 
      else {
        notifiFunction('error', result.data.enMessage)
      }
    } catch (err) {
      notifiFunction('error', err)
      console.log("err", err);
    }
  };
};

export const getInfoActionApi = (accessToken) => {
  return async (dispatch) => {
    try {
      let result = await userService.getInfoFromAccessToken(accessToken)
      if(result && result.data) {
        if(result.data.code > 0) {
          dispatch({
            type: GET_INFO_BY_ACCTOKEN,
            payload: result.data.data
          })
        } else {
          history.push('/login')
        }
      }
    } catch(err) {
      console.log('err', err)
    }
  }
}
