import { CLOSE_FORM_COURSE_DRAWER, DISPLAY_LOADING, GET_COURSE_LIST, GET_DETAIL_COURSE, HIDE_LOADING, SET_IS_UPDATE_SUCCESS } from "../../redux/types";
import { courseService } from "../../services/CourseService";
import { notifiFunction } from "../../util/notification/Notification";

export const getCourseListActionApi = (page, searchObj) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let result = await courseService.getCourseList(page, searchObj)
      if (result && result.data) {
        dispatch({
          type: GET_COURSE_LIST,
          payload: result.data
        })
      }
      dispatch({type: HIDE_LOADING})
     
    } catch (err) {
      console.log("err", err);
      dispatch({type: HIDE_LOADING})
    }
  };
};

export const getDetailCourseActionApi = (id) => {
  return async (dispatch) => {
    try {
      let result = await courseService.getDeatilCourse(id)
      if(result && result.data.code) {
        dispatch({
          type: GET_DETAIL_COURSE,
          payload: result.data.data
        })
      }
    } catch(err) {
      console.log('err', err)
    }
  }
}

export const addNewCourse = (courseInfo) => {
  return async (dispatch) => {
    try {
      let formData = new FormData();
      let {id, name, groups, description} = courseInfo
      formData.append('id', id);
      formData.append('name', name);
      formData.append('groups', Number(groups));
      formData.append('description', description);
      // for( let i = 0; i < attrIdList.length; i++ ) {
      //   formData.append('attrIdList', attrIdList[i]);
      // }
      // for( let i = 0; i < sideAttr.length; i++) {
      //   formData.append('valueList', sideAttr[i]);
      // }
      let result = await courseService.postNewCourse(formData)
      if(result && result.data?.code > 0) {
        notifiFunction('success', result.data?.enMessage)
      } 
      if(result && result.data?.code < 0) {
        notifiFunction('error', result.data?.enMessage)
      }  
      dispatch(getCourseListActionApi(1, []));
      dispatch({
        type: CLOSE_FORM_COURSE_DRAWER,
      })
      dispatch({
        type: SET_IS_UPDATE_SUCCESS,
        payload: true
      })
    } catch(err) {
      console.log('err', err)
      dispatch({
        type: SET_IS_UPDATE_SUCCESS,
        payload: false
      })
    }
  }
}

export const editCourse = (courseInfo) => {
  return async (dispatch) => {
    try {
      let formData = new FormData();
      let {id, name, groups, description} = courseInfo
      formData.append('id', id);
      formData.append('name', name);
      formData.append('groups', Number(groups));
      formData.append('description', description);
      // for( let i = 0; i < attrIdList.length; i++ ) {
      //   formData.append('attrIdList', attrIdList[i]);
      // }
      // for( let i = 0; i < sideAttr.length; i++) {
      //   formData.append('valueList', sideAttr[i]);
      // }
      console.log('id', id);
      let result = await courseService.putCourse(formData, id)
      if(result && result.data?.code > 0) {
        notifiFunction('success', result.data?.enMessage)
      } 
      if(result && result.data?.code < 0) {
        notifiFunction('error', result.data?.enMessage)
      }  
      dispatch(getCourseListActionApi(1, []))
      dispatch({
        type: CLOSE_FORM_COURSE_DRAWER,
      })
      dispatch({
        type: SET_IS_UPDATE_SUCCESS,
        payload: true
      })
    } catch(err) {
      console.log('err', err)
      dispatch({
        type: SET_IS_UPDATE_SUCCESS,
        payload: false
      })
    }
  }
}

export const deleteCourseActionApi = (id) => {
  return async (dispatch) => {
    try {
      let result = await courseService.deleteCourse(id)
      if(result && result.data) {
        dispatch({
          type: CLOSE_FORM_COURSE_DRAWER,
        })
        dispatch({
          type: SET_IS_UPDATE_SUCCESS,
          payload: true
        })
      }
      notifiFunction('success', 'Delete course successfully!')
      dispatch(getCourseListActionApi(1, []))
    } catch(err) {
      notifiFunction('error', 'Delete course failed!')
      console.log('err', err)
      dispatch({
        type: SET_IS_UPDATE_SUCCESS,
        payload: false
      })
    }
  }
}
