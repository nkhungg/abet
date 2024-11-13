import { CLOSE_FORM_COURSE_DRAWER, DISPLAY_LOADING, GET_CIR_COURSE_AUTOCOMPLETE, GET_CIR_GROUP_LIST, GET_CIR_SEMESTER_LIST, GET_COURSE_BY_CIR_LIST, GET_COURSE_ID_LIST_FROM_COURSE_OUTLINE, GET_COURSE_OUTLINE_INFO, GET_COUSE_OUTCOME_LIST, GET_GENERAL_PROGRAM_LIST, GET_INDICATORS_LIST, GET_INDICATOR_NAME_AUTOCOMPLETE, GET_LECTURERS_FROM_COURSE_OUTLINE, GET_MATRIX_OUTCOME_COURSE, GET_MATRIX_PEO, GET_OUTCOMES_FROM_COURSE_OUTLINE, GET_OUTCOMES_LIST, GET_PARENT_ID_AUTOCOMPLETE, GET_PEOS_LIST, GET_PROGRAM_LIST, HIDE_LOADING, GET_DETAILS_FROM_COURSE_OUTLINE, GET_PROGRAM_VERSION, GET_COURSE_INSTANCE, GET_PROGRAM_VERSION_IDS, GET_COURSE_INSTANCE_IDS, GET_COURSE_OUTCOMES_FROM_COURSE_INSTANCE, GET_PARENT_ID_AUTOCOMPLETE_COURSE_INSTANCE, GET_MATRIX_OUTCOME_INDICATOR, GET_COURSE_INSTANCE_OUTLINE, GET_COURSE_OUTCOMES_FROM_INSTANCE_OUTLINE, GET_OUTLINE_DETAIL_FROM_COURSE_INSTANCE, GET_CLASSES_FROM_COURSE_INSTANCE, GET_VERSION_CLASS_ASSESSMENT, GET_VERSION_CLASS_STUDENT, GET_ALL_STUDENTS, GET_STUDENTS, GET_LECTURERS, GET_SEARCH_STUDENTS, GET_DIRECT_COURSE_INSTANCE, GET_PROGRAM_INFO, GET_VERSION_COURSE_INSTANCE_TEST, GET_VERSION_COURSE_INSTANCE_TEST_COURSE_OUTCOME, GET_VERSION_COURSE_INSTANCE_TEST_QUESTION, GET_VERSION_COURSE_INSTANCE_CALSS_TEST_QUESTION, GET_VERSION_THESIS, GET_VERSION_SURVEY, GET_SURVEYS, GET_VERSION_SURVEY_QUESTION, GET_ALL_OUTCOME_LIST, GET_VERSION_FOUNDATION_TEST_SUBJECTS, GET_ALL_SUBJECTS, GET_VERSION_FOUNDATION_TEST_QUESTIONS, GET_ALL_INDICATOR_BY_OUTCOME_NAME, GET_VERSION_FOUNDATION_TEST_RESULT, GET_VERSION_FOUNDATION_TEST_RESULT_ANSWER, GET_VERSION_SURVEY_RESULT, GET_VERSION_SURVEY_RESULT_STAT, GET_VERSION_SURVEY_RESULT_STAT_OPTIONS, GET_VERSION_SURVEY_RESULT_ANSWER_OPTIONS, GET_ALL_SUBJECTS_SIDEBAR, SET_IS_UPDATE_SUCCESS, GET_USERS } from "../../redux/types";
import { notifiFunction } from "../../util/notification/Notification";
import { programService } from "../../services/ProgramService";

// A.GET LIST TABLE PROGRAM SYSTEM

// 1. General program

export const getGeneralProgramListActionApi = (page, searchObj = []) => {
    return async (dispatch) => {
      dispatch({type: DISPLAY_LOADING})
      try {
        let result = await programService.getGeneralProgramList(page, searchObj)
        if (result && result.data) {
          dispatch({
            type: GET_GENERAL_PROGRAM_LIST,
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

// 2. Program

export const getProgramByGenProgramActionApi = (page, id, searchObj = []) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let result = await programService.getProgramByGenProgramList(page, id, searchObj)
      if (result && result.data) {
        dispatch({
          type: GET_PROGRAM_LIST,
          payload: result.data
        })
      }
      dispatch({type: HIDE_LOADING})
    } catch(err) {
      dispatch({type: HIDE_LOADING})
      console.log('err', err);
    }
  }
}

//  3. PEOs

export const getPEOsByProgarmActionApi = (page, id, searchObj = []) => { 
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let result = await programService.getPEOsByProgramList(page, id, searchObj)
      if (result && result.data) {
        dispatch({
          type: GET_PEOS_LIST,
          payload: result.data
        })
      }
      dispatch({type: HIDE_LOADING})
    } catch(err) {
      dispatch({type: HIDE_LOADING})
      console.log('err', err);
    }
  }
}

// 4. Outcomes

export const getOutcomesByProgramActionApi = (page, id, searchObj = []) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let result = await programService.getOutcomesByProgramList(page, id, searchObj)
      if (result && result.data) {
        dispatch({
          type: GET_OUTCOMES_LIST,
          payload: result.data
        })
      }
      dispatch({type: HIDE_LOADING})
    } catch(err) {
      dispatch({type: HIDE_LOADING})
      console.log('err', err);
    }
  }
}

//  4.1 Indicators from outcomes

export const getIndicatorsByOutcomeActionApi = (page, programId, outcomeName, searchedObj) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let result = await programService.getIndicatorsByOutcomeList(page, programId, outcomeName, searchedObj)
      if (result && result.data) {
        dispatch({
          type: GET_INDICATORS_LIST,
          payload: result.data
        })
      }
      dispatch({type: HIDE_LOADING})
    } catch(err) {
      dispatch({type: HIDE_LOADING})
      console.log('err', err);
    }
  }
}

// 5. Currilculum

// 5.1 Currilculum semester

export const getCirrSemesterActionApi = (programId) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let result = await programService.getCirrSemesterList(programId)
      if (result && result.data) {
        dispatch({
          type: GET_CIR_SEMESTER_LIST,
          payload: result.data
        })
      }
      dispatch({type: HIDE_LOADING})
    } catch(err) {
      dispatch({type: HIDE_LOADING})
      console.log('err', err);
    }
  }
}

// 5.2 Currilculum groups

export const getCirrGroupActionApi = (programId) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let result = await programService.getCirrGroupsList(programId)
      if (result && result.data) {
        dispatch({
          type: GET_CIR_GROUP_LIST,
          payload: result.data
        })
      }
      dispatch({type: HIDE_LOADING})
    } catch(err) {
      dispatch({type: HIDE_LOADING})
      console.log('err', err);
    }
  }
}

// 5.3 Courses by cirricumun

export const getCourseByCirrActionApi = (page, programId, id, type, searchObj = []) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let result = await programService.getCourseByCirrList(page, programId, id, type, searchObj)
      if (result && result.data) {
        dispatch({
          type: GET_COURSE_BY_CIR_LIST,
          payload: result.data
        })
      }
      dispatch({type: HIDE_LOADING})
    } catch(err) {
      dispatch({type: HIDE_LOADING})
      console.log('err', err);
    }
  }
}

//  6. Matrix PEO

export const getMatrixPeoActionApi = (programId, page) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let result = await programService.getMatrixPeo(programId, page)
      if (result && result.data) {
        dispatch({
          type: GET_MATRIX_PEO,
          payload: result.data
        })
      }
      dispatch({type: HIDE_LOADING})
    } catch(err) {
      dispatch({type: HIDE_LOADING})
      console.log('err', err);
    }
  }
}

// 6.1. Post Matrix PEO

export const postMatrixPeoActionApi = (programId, peoOutcome, page = 1) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let result = await programService.postMatrixPeo(programId, peoOutcome)
      if(result && result.data?.code > 0) {
        notifiFunction('success', result.data?.enMessage)
      } 
      if(result && result.data?.code < 0) {
        notifiFunction('error', result.data?.enMessage)
      }  
      dispatch(getMatrixPeoActionApi(programId, page))
      dispatch({type: HIDE_LOADING})
    } catch(err) {
      dispatch({type: HIDE_LOADING})
      console.log('err', err);
    }
  }
}

// 7. Matrix Outcome course

export const getMatrixOutcomeCourseActionApi = (programId, page) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try { 
      let result = await programService.getMatrixOutcomeCourse(programId, page)
      if (result && result.data) {
        dispatch({
          type: GET_MATRIX_OUTCOME_COURSE,
          payload: result.data
        })
      }
      dispatch({type: HIDE_LOADING})
    } catch(err) {
      dispatch({type: HIDE_LOADING})
      console.log('err', err);
    }
  }
}

// 7.1. Post Matrix Outcome Course

export const postMatrixOutcomeCourseActionApi = (programId, OutcomeCourse, page) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let result = await programService.postMatrixOutcomeCourse(programId, OutcomeCourse)
      if(result && result.data?.code > 0) {
        notifiFunction('success', result.data?.enMessage)
      } 
      if(result && result.data?.code < 0) {
        notifiFunction('error', result.data?.enMessage)
      }  
      dispatch(getMatrixOutcomeCourseActionApi(programId, page))
      dispatch({type: HIDE_LOADING})
    } catch(err) {
      dispatch({type: HIDE_LOADING})
      console.log('err', err);
    }
  }
}

// 8. Get general-course-id List

export const getCourseAutocompleteActionApi = () => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try { 
      let result = await programService.getCourseAutocomplete()
      if (result && result.data) {
        dispatch({
          type: GET_CIR_COURSE_AUTOCOMPLETE,
          payload: result.data
        })
      }
      dispatch({type: HIDE_LOADING})
    } catch(err) {
      dispatch({type: HIDE_LOADING})
      console.log('err', err);
    }
  }
}

// 9. Get Course Outcome 

export const getCourseOutcomeActionApi = (programId, courseId, page, searchObj = []) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let result = await programService.getCourseOutcome(programId, courseId, page, searchObj)
      if (result && result.data) {
        dispatch({
          type: GET_COUSE_OUTCOME_LIST,
          payload: result.data
        })
      }
      dispatch({type: HIDE_LOADING})
    } catch(err) {
      dispatch({type: HIDE_LOADING})
      console.log('err', err);
    }
  }
}

// 10. Get Indicator Name autocomplete

export const getIndicatorAutocompleteActionApi = (programId) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let result = await programService.getIndicatorAutocomplete(programId)
      if (result && result.data) {
        dispatch({
          type: GET_INDICATOR_NAME_AUTOCOMPLETE,
          payload: result.data
        })
      }
      dispatch({type: HIDE_LOADING})
    } catch(err) {
      dispatch({type: HIDE_LOADING})
      console.log('err', err);
    }
  }
}

// 11. Get Parent Outcome autocomplete

export const getParentOutcomeAutocompleteActionApi = (programId, courseId) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let result = await programService.getParentOutcomeAutocomplete(programId, courseId)
      if (result && result.data) {
        dispatch({
          type: GET_PARENT_ID_AUTOCOMPLETE,
          payload: result.data
        })
      }
      dispatch({type: HIDE_LOADING})
    } catch(err) {
      dispatch({type: HIDE_LOADING})
      console.log('err', err);
    }
  }
}


// B.FORM PROGRAM SYSTEM

// 0. Form General Program

// 0.1 Post new general program

export const addNewGeneralProgramActionApi = (generalProgramInfo) => {
  return async (dispatch) => {
    try {
      let formData = new FormData();
      let {id, name, major, description} = generalProgramInfo
      formData.append('id', id);
      formData.append('name', name);
      formData.append('major', major);
      formData.append('description', description);
      let result = await programService.postNewGeneralProgram(formData)
      if(result && result.data?.code > 0) {
        notifiFunction('success', result.data?.enMessage)
      } 
      if(result && result.data?.code < 0) {
        notifiFunction('error', result.data?.enMessage)
      }  
      dispatch({
        type: CLOSE_FORM_COURSE_DRAWER,
      })
      dispatch(getGeneralProgramListActionApi(1))
    } catch(err) {
      console.log('err', err)
    }
  }
}


// 0.2 Edit general program

export const editGeneralProgramActionApi = (generalProgramInfo) => {
  return async (dispatch) => {
    try {
      let formData = new FormData();
      let {id, name, major, description} = generalProgramInfo
      formData.append('id', id);
      formData.append('name', name);
      formData.append('major', major);
      formData.append('description', description);
      let result = await programService.editGeneralProgram(formData, id)
      if(result && result.data?.code > 0) {
        notifiFunction('success', result.data?.enMessage)
      } 
      if(result && result.data?.code < 0) {
        notifiFunction('error', result.data?.enMessage)
      } 
      dispatch({
        type: CLOSE_FORM_COURSE_DRAWER,
      }) 
      dispatch(getGeneralProgramListActionApi(1))
    } catch(err) {
      console.log('err', err)
    }
  }
}


// 0.3 Delete general program

export const deleteGeneralProgramActionApi = (idGeneralProgram) => {
  return async (dispatch) => {
    try {
      let result = await programService.deleteGeneralProgram(idGeneralProgram)
      if(result && result.data) {
        dispatch({
          type: CLOSE_FORM_COURSE_DRAWER,
        })
      }
      notifiFunction('success', 'Delete course successfully!')
      dispatch(getGeneralProgramListActionApi(1))
    } catch(err) {
      notifiFunction('error', 'Delete course failed!')
      console.log('err', err);
    }
  }
}


// 1. Program

// 1.1 Post new program
export const addNewProgramActionApi = (programInfo) => {
  return async (dispatch) => {
    try {
      let formData = new FormData();
      let {idGeneralProgram, id, major, description, start, end, apply} = programInfo
      formData.append('idGeneralProgram', idGeneralProgram);
      formData.append('id', id);
      formData.append('major', major);
      formData.append('description', description);
      formData.append('start', start);
      formData.append('end', end);
      formData.append('apply', apply);
      let result = await programService.postNewProgram(formData)
      if(result && result.data?.code > 0) {
        notifiFunction('success', result.data?.enMessage)
      } 
      if(result && result.data?.code < 0) {
        notifiFunction('error', result.data?.enMessage)
      }  
      dispatch({
        type: CLOSE_FORM_COURSE_DRAWER,
      })
      dispatch({
        type: SET_IS_UPDATE_SUCCESS,
        payload: true
      })
      dispatch(getProgramByGenProgramActionApi(1, idGeneralProgram, []))
    } catch(err) {
      console.log('err', err)
      dispatch({
        type: SET_IS_UPDATE_SUCCESS,
        payload: false
      })
    }
  }
}

// 1.2 Put program
export const editProgramActionApi = (programInfo) => {
  return async (dispatch) => {
    try {
      let formData = new FormData();
      let {idGeneralProgram, id, major, description, start, end, apply} = programInfo
      formData.append('idGeneralProgram', idGeneralProgram);
      formData.append('id', id);
      formData.append('major', major);
      formData.append('description', description);
      formData.append('start', start);
      formData.append('end', end);
      formData.append('apply', apply);
      let result = await programService.editProgram(formData, id)
      if(result && result.data?.code > 0) {
        notifiFunction('success', result.data?.enMessage)
      } 
      if(result && result.data?.code < 0) {
        notifiFunction('error', result.data?.enMessage)
      } 
      dispatch({
        type: CLOSE_FORM_COURSE_DRAWER,
      }) 
      dispatch({
        type: SET_IS_UPDATE_SUCCESS,
        payload: true
      })
      dispatch(getProgramByGenProgramActionApi(1, idGeneralProgram, []))
    } catch(err) {
      console.log('err', err)
      dispatch({
        type: SET_IS_UPDATE_SUCCESS,
        payload: false
      })
    }
  }
}

// 1.3 Delete program
export const deleteProgramActionApi = (idGeneralProgram, idProgram) => {
  return async (dispatch) => {
    try {
      let result = await programService.deleteProgram(idProgram)
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
      dispatch(getProgramByGenProgramActionApi(1, idGeneralProgram, []))
    } catch(err) {
      notifiFunction('error', 'Delete course failed!')
      console.log('err', err);
      dispatch({
        type: SET_IS_UPDATE_SUCCESS,
        payload: false
      })
    }
  }
}

// 2. Peos by program

// 2.1 Post new peos
export const addNewPeosActionApi = (peosInfo) => {
  return async (dispatch) => {
    try {
      let formData = new FormData();
      let {programId, name, priority, description} = peosInfo
      formData.append('programId', programId);
      formData.append('name', name);
      formData.append('priority', priority);
      formData.append('description', description);
      let result = await programService.postNewPeos(formData, programId)
      if(result && result.data?.code > 0) {
        notifiFunction('success', result.data?.enMessage)
      } 
      if(result && result.data?.code < 0) {
        notifiFunction('error', result.data?.enMessage)
      }  
      dispatch({
        type: CLOSE_FORM_COURSE_DRAWER,
      })
      dispatch({
        type: SET_IS_UPDATE_SUCCESS,
        payload: true
      })
      dispatch(getPEOsByProgarmActionApi(1, programId, []))
    } catch(err) {
      notifiFunction('error', 'Failed!' )
      console.log('err', err)
      dispatch({
        type: SET_IS_UPDATE_SUCCESS,
        payload: false
      })
    }
  }
}

// 2.2 Edit peos
export const editPeosActionApi = (peosInfo) => {
  return async (dispatch) => {
    try {
      let formData = new FormData();
      let {programId, name, priority, description} = peosInfo
      formData.append('programId', programId);
      formData.append('name', name);
      formData.append('priority', priority);
      formData.append('description', description);
      let result = await programService.editPeos(formData, programId, name)
      if(result && result.data?.code > 0) {
        notifiFunction('success', result.data?.enMessage)
      } 
      if(result && result.data?.code < 0) {
        notifiFunction('error', result.data?.enMessage)
      }  
      dispatch({
        type: CLOSE_FORM_COURSE_DRAWER,
      })
      dispatch({
        type: SET_IS_UPDATE_SUCCESS,
        payload: true
      })
      dispatch(getPEOsByProgarmActionApi(1, programId, []))
    } catch(err) {
      notifiFunction('error', 'Failed!' )
      console.log('err', err)
      dispatch({
        type: SET_IS_UPDATE_SUCCESS,
        payload: false
      })
    }
  }
}

// 2.3 Delete peos
export const deletePeosActionApi = (programId, peoId) => {
  return async (dispatch) => {
    try {
      let result = await programService.deletePeos(programId, peoId)
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
      dispatch(getPEOsByProgarmActionApi(1, programId, []))
    } catch(err) {
      notifiFunction('error', 'Delete course failed!')
      console.log('err', err);
      dispatch({
        type: SET_IS_UPDATE_SUCCESS,
        payload: false
      })
    }
  }
}

// 3. ProgramOutcomes by program

// 3.1 Post new outcomes
export const addNewOutcomesActionApi = (outcomeInfo) => {
  return async (dispatch) => {
    try {
      let formData = new FormData();
      let {programId, outcomeName, cdio, description} = outcomeInfo
      formData.append('programId', programId);
      formData.append('outcomeName', outcomeName);
      formData.append('cdio', cdio);
      formData.append('description', description);
      let result = await programService.postNewOutcomes(formData, programId)
      if(result && result.data?.code > 0) {
        notifiFunction('success', result.data?.enMessage)
      } 
      if(result && result.data?.code < 0) {
        notifiFunction('error', result.data?.enMessage)
      }  
      dispatch({
        type: CLOSE_FORM_COURSE_DRAWER,
      })
      dispatch({
        type: SET_IS_UPDATE_SUCCESS,
        payload: true
      })
      dispatch(getOutcomesByProgramActionApi(1, programId))
    } catch(err) {
      notifiFunction('error', 'Failed!' )
      console.log('err', err)
      dispatch({
        type: SET_IS_UPDATE_SUCCESS,
        payload: false
      })
    }
  }
}

// 3.2 Edit outcomes
export const editOutcomesActionApi = (outcomeInfo) => {
  return async (dispatch) => {
    try {
      let formData = new FormData();
      let {programId, outcomeName, cdio, description} = outcomeInfo
      formData.append('programId', programId);
      formData.append('outcomeName', outcomeName);
      formData.append('cdio', cdio);
      formData.append('description', description);
      let result = await programService.editOutcome(formData, programId, outcomeName)
      if(result && result.data?.code > 0) {
        notifiFunction('success', result.data?.enMessage)
      } 
      if(result && result.data?.code < 0) {
        notifiFunction('error', result.data?.enMessage)
      }  
      dispatch({
        type: CLOSE_FORM_COURSE_DRAWER,
      })
      dispatch({
        type: SET_IS_UPDATE_SUCCESS,
        payload: true
      })
      dispatch(getOutcomesByProgramActionApi(1, programId))
    } catch(err) {
      notifiFunction('error', 'Failed!' )
      console.log('err', err)
      dispatch({
        type: SET_IS_UPDATE_SUCCESS,
        payload: false
      })
    }
  }
}

// 3.3 Delete outcome
export const deleteOutcomesActionApi = (programId, outcomeName) => {
  return async (dispatch) => {
    try {
      let result = await programService.deleteOutcomes(programId, outcomeName)
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
      dispatch(getOutcomesByProgramActionApi(1, programId))
    } catch(err) {
      notifiFunction('error', 'Delete course failed!')
      console.log('err', err);
      dispatch({
        type: SET_IS_UPDATE_SUCCESS,
        payload: false
      })
    }
  }
}

// 4. Curriculum form

// 4.1 Post new semester or group by crriculum

export const addNewSemesterGroupActionApi = (curriculum, type) => {
  return async (dispatch) => {
    try {
      let {programId} = curriculum
      let result = await programService.postNewSemesterGroup(curriculum,programId, type)
      if(result && result.data?.code > 0) {
        notifiFunction('success', result.data?.enMessage)
      } 
      if(result && result.data?.code < 0) {
        notifiFunction('error', result.data?.enMessage)
      }  
      dispatch({
        type: CLOSE_FORM_COURSE_DRAWER,
      })
      if(type) {
        dispatch(getCirrSemesterActionApi(programId))
      } else {
        dispatch(getCirrGroupActionApi(programId))
      }
    } catch(err) {
      notifiFunction('error', 'Failed!' )
      console.log('err', err)
    }
  }
}

// 4.2 Edit semester or group by crriculum

export const editSemesterGroupActionApi = (curriculum, type) => {
  return async (dispatch) => {
    try {
      let {programId, id} = curriculum
      let result = await programService.editSemesterGroup(curriculum, programId, id, type)
      if(result && result.data?.code > 0) {
        notifiFunction('success', result.data?.enMessage)
      } 
      if(result && result.data?.code < 0) {
        notifiFunction('error', result.data?.enMessage)
      }  
      dispatch({
        type: CLOSE_FORM_COURSE_DRAWER,
      })
      if(type) {
        dispatch(getCirrSemesterActionApi(programId))
      } else {
        dispatch(getCirrGroupActionApi(programId))
      }
    } catch(err) {
      notifiFunction('error', 'Failed!' )
      console.log('err', err)
    }
  }
}

// 4.3 Delete semester or group by crriculum

export const deleteSemesterGroupActionApi = (programId, id, type) => {
  return async (dispatch) => {
    try {
      let result = await programService.deleteSemesterGroup(programId, id, type)
      if(result && result.data) {
        dispatch({
          type: CLOSE_FORM_COURSE_DRAWER,
        })
      }
      notifiFunction('success', 'Delete course successfully!')
      if(type) {
        dispatch(getCirrSemesterActionApi(programId))
      } else {
        dispatch(getCirrGroupActionApi(programId))
      }
    } catch(err) {
      notifiFunction('error', 'Delete course failed!')
      console.log('err', err);
    }
  }
}

// 5. Form Indicators

// 5.1 Post new indicators

export const addNewIndicatorsActionApi = (indicatorInfo) => {
  return async (dispatch) => {
    try {
      let formData = new FormData();
      let {programId, outcomeName, name, cdio, level, description, additionalQuestion, comment, levelSet, descriptionSet} = indicatorInfo
      formData.append('programId', programId);
      formData.append('outcomeName', outcomeName);
      formData.append('name', name);
      formData.append('cdio', cdio);
      formData.append('level', level);
      formData.append('description', description);
      formData.append('additionalQuestion', additionalQuestion);
      formData.append('comment', comment ? 1 : 0);
      for (let i = 0; i < levelSet.length; i++) {
        const element = levelSet[i];
        formData.append('levelIdList', element)
      }
      for (let i = 0; i < descriptionSet.length; i++) {
        const element = descriptionSet[i];
        formData.append('descriptionList', element)
      }
      let result = await programService.postNewIndicators(formData, programId, outcomeName)
      if(result && result.data?.code > 0) {
        notifiFunction('success', result.data?.enMessage)
      } 
      if(result && result.data?.code < 0) {
        notifiFunction('error', result.data?.enMessage)
      }  
      dispatch({
        type: CLOSE_FORM_COURSE_DRAWER,
      })
      dispatch({
        type: SET_IS_UPDATE_SUCCESS,
        payload: true
      })
      dispatch(getIndicatorsByOutcomeActionApi(1, programId, outcomeName))
    } catch(err) {
      notifiFunction('error', 'Failed!' )
      console.log('err', err)
      dispatch({
        type: SET_IS_UPDATE_SUCCESS,
        payload: false
      })
    }
  }
}

// 5.2 EDit indicators

export const editIndicatorsActionApi = (indicatorInfo) => {
  return async (dispatch) => {
    try {
      let formData = new FormData();
      let {programId, outcomeName, name, cdio, level, description, additionalQuestion, comment, levelSet, descriptionSet} = indicatorInfo
      formData.append('programId', programId);
      formData.append('outcomeName', outcomeName);
      formData.append('name', name);
      formData.append('cdio', cdio);
      formData.append('level', level);
      formData.append('description', description);
      formData.append('additionalQuestion', additionalQuestion);
      formData.append('comment', comment ? 1 : 0);
      for (let i = 0; i < levelSet.length; i++) {
        const element = levelSet[i];
        formData.append('levelIdList', element)
      }
      for (let i = 0; i < descriptionSet.length; i++) {
        const element = descriptionSet[i];
        formData.append('descriptionList', element)
      }
      let result = await programService.editIndicators(formData, programId, outcomeName, name)
      if(result && result.data?.code > 0) {
        notifiFunction('success', result.data?.enMessage)
      } 
      if(result && result.data?.code < 0) {
        notifiFunction('error', result.data?.enMessage)
      }  
      dispatch({
        type: CLOSE_FORM_COURSE_DRAWER,
      })
      dispatch({
        type: SET_IS_UPDATE_SUCCESS,
        payload: true
      })
      dispatch(getIndicatorsByOutcomeActionApi(1, programId, outcomeName))
    } catch(err) {
      notifiFunction('error', 'Failed!' )
      console.log('err', err)
      dispatch({
        type: SET_IS_UPDATE_SUCCESS,
        payload: false
      })
    }
  }
}

// 5.3 Delete indicators

export const deleteIndicatorActionApi = (programId, outcomeName, indicatorName) => {
  return async (dispatch) => {
    try {
      let result = await programService.deleteIndicator(programId, outcomeName, indicatorName)
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
      dispatch(getIndicatorsByOutcomeActionApi(1, programId, outcomeName))
    } catch(err) {
      notifiFunction('error', 'Delete course failed!')
      console.log('err', err);
      dispatch({
        type: SET_IS_UPDATE_SUCCESS,
        payload: false
      })
    }
  }
}

// 6 Form curriculum course 

// 6.1 Post new curriculum course

export const addpostNewCirrCourseActionApi = (cirrCourseInfo) => {
  return async (dispatch) => {
    try {
      let formData = new FormData();
      let {programId, semesterId, groupId, id, name, credit, type} = cirrCourseInfo
      formData.append('programId', programId);
      formData.append('semesterId', semesterId);
      formData.append('groupId', groupId);
      formData.append('id', id);
      formData.append('name', name);
      formData.append('credit', credit);
      let result = await programService.postNewCirrCourse(programId, formData, type ? semesterId : groupId, type)
      if(result && result.data?.code > 0) {
        notifiFunction('success', result.data?.enMessage)
      } 
      if(result && result.data?.code < 0) {
        notifiFunction('error', result.data?.enMessage)
      }  
      dispatch({
        type: CLOSE_FORM_COURSE_DRAWER,
      })
      dispatch({
        type: SET_IS_UPDATE_SUCCESS,
        payload: true
      })
      dispatch(getCourseByCirrActionApi(1, programId, type ? semesterId : groupId, type))
    } catch(err) {
      notifiFunction('error', 'Failed!' )
      console.log('err', err)
      dispatch({
        type: SET_IS_UPDATE_SUCCESS,
        payload: false
      })
    }
  }
}

// 6.2 Edit curriculum course

export const editCirrCourseActionApi = (cirrCourseInfo) => {
  return async (dispatch) => {
    try {
      let formData = new FormData();
      let {programId, semesterId, groupId, id, name, credit, type} = cirrCourseInfo
      formData.append('programId', programId);
      formData.append('semesterId', semesterId);
      formData.append('groupId', groupId);
      formData.append('id', id);
      formData.append('name', name);
      formData.append('credit', credit);
      let result = await programService.editCirrCourse(programId, formData, type ? semesterId : groupId, id, type)
      if(result && result.data?.code > 0) {
        notifiFunction('success', result.data?.enMessage)
      } 
      if(result && result.data?.code < 0) {
        notifiFunction('error', result.data?.enMessage)
      }  
      dispatch({
        type: CLOSE_FORM_COURSE_DRAWER,
      })
      dispatch({
        type: SET_IS_UPDATE_SUCCESS,
        payload: true
      })
      dispatch(getCourseByCirrActionApi(1, programId, type ? semesterId : groupId, type))
    } catch(err) {
      notifiFunction('error', 'Failed!' )
      console.log('err', err)
      dispatch({
        type: SET_IS_UPDATE_SUCCESS,
        payload: false
      })
    }
  }
}

// 6.3 Delete curriculum course

export const deleteCirrCourseActionApi = (cirrCourseInfo) => {
  return async (dispatch) => {
    try {
      let {programId, semesterId, groupId, id, type} = cirrCourseInfo
      let result = await programService.deleteCirrCourse(programId, type ? semesterId : groupId, id, type)
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
      dispatch(getCourseByCirrActionApi(1, programId, type ? semesterId : groupId, type))
    } catch(err) {
      notifiFunction('error', 'Delete course failed!')
      console.log('err', err);
      dispatch({
        type: SET_IS_UPDATE_SUCCESS,
        payload: false
      })
    }
  }
}


// 7. Form course-outcome

// 7.1 Add new course-outcome

export const postNewCourseOutcomeActionApi = (cirrCourseInfo) => {
  return async (dispatch) => {
    try {
      let formData = new FormData();
      let {programId, courseId, name, description, cdio, percentIndicator, indicatorName, parentId} = cirrCourseInfo
      formData.append('programId', programId);
      formData.append('courseId', courseId);
      formData.append('name', name);
      formData.append('description', description);
      formData.append('cdio', cdio);
      formData.append('percentIndicator', percentIndicator);
      formData.append('indicatorName', indicatorName);
      formData.append('parentId', parentId);
      let result = await programService.postNewCourseOutcome(programId, courseId, formData)
      if(result && result.data?.code > 0) {
        notifiFunction('success', result.data?.enMessage)
      } 
      if(result && result.data?.code < 0) {
        notifiFunction('error', result.data?.enMessage)
      }  
      dispatch({
        type: CLOSE_FORM_COURSE_DRAWER,
      })
      dispatch({
        type: SET_IS_UPDATE_SUCCESS,
        payload: true
      })
      dispatch(getCourseOutcomeActionApi(programId, courseId, 1))
      dispatch(getCourseOutcomesInCourseOutlineActionApi(programId, courseId));
    } catch(err) {
      notifiFunction('error', 'Failed!' )
      console.log('err', err)
      dispatch({
        type: SET_IS_UPDATE_SUCCESS,
        payload: false
      })
    }
  }
}

// 7.2 Edit course-outcome

export const editCourseOutcomeActionApi = (cirrCourseInfo) => {
  return async (dispatch) => {
    try {
      let {programId, courseId, id} = cirrCourseInfo
      let result = await programService.editCourseOutcome(programId, courseId, id, cirrCourseInfo)
      if(result && result.data?.code > 0) {
        notifiFunction('success', result.data?.enMessage)
      } 
      if(result && result.data?.code < 0) {
        notifiFunction('error', result.data?.enMessage)
      }  
      dispatch({
        type: CLOSE_FORM_COURSE_DRAWER,
      })
      dispatch({
        type: SET_IS_UPDATE_SUCCESS,
        payload: true
      })
      dispatch(getCourseOutcomeActionApi(programId, courseId, 1))
      dispatch(getCourseOutcomesInCourseOutlineActionApi(programId, courseId));
    } catch(err) {
      notifiFunction('error', 'Failed!' )
      console.log('err', err)
      dispatch({
        type: SET_IS_UPDATE_SUCCESS,
        payload: false
      })
    }
  }
}

// 7.3 Delete course-outcom

export const deleteCourseOutcomeActionApi = (cirrCourseInfo) => {
  return async (dispatch) => {
    try {
      let {programId, courseId, id} = cirrCourseInfo
      let result = await programService.deleteCourseOutcome(programId, courseId, id)
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
      dispatch(getCourseOutcomeActionApi(programId, courseId, 1))
      dispatch(getCourseOutcomesInCourseOutlineActionApi(programId, courseId));
    } catch(err) {
      notifiFunction('error', 'Delete course failed!')
      console.log('err', err);
      dispatch({
        type: SET_IS_UPDATE_SUCCESS,
        payload: false
      })
    }
  }
}

 // 8.  COURSE OUTLINE

// 8. Course outline p1 p2 p3 p5 p6

export const getCourseOutlineActionApi = (programId, courseId) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let result = await programService.getCourseOutline(programId, courseId)
      if (result && result.data) {
        dispatch({
          type: GET_COURSE_OUTLINE_INFO,
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

export const getCourseIdListCourseOutlineActionApi = (programId) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let result = await programService.getCourseIdListCourseOutline(programId)
      if (result && result.data) {
        dispatch({
          type: GET_COURSE_ID_LIST_FROM_COURSE_OUTLINE,
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

export const editCourseOutlineEditorActionApi = (programId, courseId, data) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let result = await programService.editCourseOutlineEditor(programId, courseId, data)
      if (result && result.data) {
        dispatch({
          type: GET_COURSE_OUTLINE_INFO,
          payload: result.data
        })
      }
      dispatch(getCourseOutlineActionApi(programId, courseId))
    } catch (err) {
      console.log("err", err);
    }
    dispatch({type: HIDE_LOADING})
  };
};

export const getLecturerListActionApi = (page, pageSize) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let result = await programService.getLecturerList(page, pageSize)
      if (result && result.data) {
        dispatch({
          type: GET_LECTURERS_FROM_COURSE_OUTLINE,
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

// 10. tab course-outcomes in course outline  

export const getCourseOutcomesInCourseOutlineActionApi = (programId, courseId) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let result = await programService.getCourseOutcomesInCourseOutline(programId, courseId)
      if (result && result.data) {
        dispatch({
          type: GET_OUTCOMES_FROM_COURSE_OUTLINE,
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

// 11. tab details in course outline

export const getCourseDetailInCourseOutlineActionApi = (programId, courseId, type) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let result = await programService.getCourseDetailInCourseOutline(programId, courseId, type)
      if (result && result.data) {
        dispatch({
          type: GET_DETAILS_FROM_COURSE_OUTLINE,
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

// 11.2 post new details in course outline
export const postCourseDetailInCourseOutlineActionApi = (courseDetail) => {
  return async (dispatch) => {
    try {
      let {programId, courseId, type } = courseDetail
      let result = await programService.postCourseDetailInCourseOutline(programId, courseId, courseDetail)
      if(result && result.data?.code > 0) {
        notifiFunction('success', result.data?.enMessage)
      } 
      if(result && result.data?.code < 0) {
        notifiFunction('error', result.data?.enMessage)
      }  
      dispatch({
        type: CLOSE_FORM_COURSE_DRAWER,
      })
      dispatch(getCourseDetailInCourseOutlineActionApi(programId, courseId, type))
    } catch(err) {
      notifiFunction('error', 'Failed!' )
      console.log('err', err)
    }
  }
}

 // 11.3 edit details in course outline
export const editCourseDetailInCourseOutlineActionApi = (courseDetail) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let {programId, courseId, id, type } = courseDetail
      let result = await programService.editCourseDetailInCourseOutline(programId, courseId, id, courseDetail)
      if (result && result.data) {
        notifiFunction('success', result.data?.enMessage)
      }
      if(result && result.data?.code < 0) {
        notifiFunction('error', result.data?.enMessage)
      } 
      dispatch({
        type: CLOSE_FORM_COURSE_DRAWER,
      })
      dispatch(getCourseDetailInCourseOutlineActionApi(programId, courseId, type))
    } catch (err) {
      console.log("err", err);
      dispatch({type: HIDE_LOADING})
    }
  };
};

// 11.4 edit details in course outline
export const deleteCourseDetailInCourseOutlineActionApi = (courseDetail) => {
  return async (dispatch) => {
    try {
      let {programId, courseId, id, type} = courseDetail
      let result = await programService.deleteCourseDetailInCourseOutline(programId, courseId, id)
      if(result && result.data) {
        dispatch({
          type: CLOSE_FORM_COURSE_DRAWER,
        })
      }
      notifiFunction('success', 'Delete course successfully!')
      dispatch(getCourseDetailInCourseOutlineActionApi(programId, courseId, type))
    } catch(err) {
      notifiFunction('error', 'Delete course failed!')
      console.log('err', err);
    }
  }
}

// 12. PROGRAM VERSION 

// 12.1. Get program version 
export const getProgramVersionActionApi = (page, searchContent) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let result = await programService.getProgramVersion(page, searchContent)
      if (result && result.data) {
        dispatch({
          type: GET_PROGRAM_VERSION,
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

// 12.2 Post new program version
export const postNewProgramVersionActionApi = (programVersion) => {
  return async (dispatch) => {
    try {
      let result = await programService.postNewProgramVersion(programVersion)
      if(result && result.data?.code > 0) {
        notifiFunction('success', result.data?.enMessage)
      } 
      if(result && result.data?.code < 0) {
        notifiFunction('error', result.data?.enMessage)
      }  
      dispatch({
        type: CLOSE_FORM_COURSE_DRAWER,
      })
      dispatch(getProgramVersionActionApi(1))
    } catch(err) {
      notifiFunction('error', 'Failed!' )
      console.log('err', err)
    }
  }
}

// 12.3 Edit program version
export const editProgramVersionActionApi = (programVersion) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let { id } = programVersion
      let result = await programService.editProgramVersion(id, programVersion)
      if (result && result.data) {
        notifiFunction('success', result.data?.enMessage)
      }
      if(result && result.data?.code < 0) {
        notifiFunction('error', result.data?.enMessage)
      } 
      dispatch({
        type: CLOSE_FORM_COURSE_DRAWER,
      })
      dispatch(getProgramVersionActionApi(1))
    } catch (err) {
      console.log("err", err);
      notifiFunction('error', 'Failed!' )
      dispatch({type: HIDE_LOADING})
    }
  };
};

 // 12.4 Delete program version
export const deleteProgramVersionActionApi = (programVersion) => {
  return async (dispatch) => {
    try {
      let {id} = programVersion
      let result = await programService.deleteProgramVersion(id)
      if(result && result.data) {
        dispatch({
          type: CLOSE_FORM_COURSE_DRAWER,
        })
      }
      notifiFunction('success', 'Delete course successfully!')
      dispatch(getProgramVersionActionApi(1))
    } catch(err) {
      notifiFunction('error', 'Delete course failed!')
      console.log('err', err);
    }
  }
}

// 12.5 Get options of select programIds

export const getProgramVersionIdsActionApi = () => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let result = await programService.getProgramVersionIds()
      if (result && result.data) {
        dispatch({
          type: GET_PROGRAM_VERSION_IDS,
          payload: result.data.data
        })
      }
      dispatch({type: HIDE_LOADING})
    } catch (err) {
      console.log("err", err);
      dispatch({type: HIDE_LOADING})
    }
  };
};


// 13. Get course Instance
export const getCourseInstanceProgramVersionActionApi = (programVersionInfo, page, searchObj = []) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let result = await programService.getCourseInstanceProgramVersion(programVersionInfo, page, searchObj)
      if (result && result.data) {
        dispatch({
          type: GET_COURSE_INSTANCE,
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

// 13.2 Post new course Instance
export const postNewCourseInstanceProgramVersionActionApi = (programVersionInfo, data) => {
  return async (dispatch) => {
    try {
      let result = await programService.postNewCourseInstanceProgramVersion(programVersionInfo, data)
      if(result && result.data?.code > 0) {
        notifiFunction('success', result.data?.enMessage)
      } 
      if(result && result.data?.code < 0) {
        notifiFunction('error', result.data?.enMessage)
      }  
      dispatch({
        type: CLOSE_FORM_COURSE_DRAWER,
      })
      dispatch(getCourseInstanceProgramVersionActionApi(programVersionInfo, 1))
      dispatch(getDirectCourseInstanceActionApi(1));
    } catch(err) {
      notifiFunction('error', 'Failed!' )
      console.log('err', err)
    }
  }
}

// 13.3 Edit course Instance
export const editCourseInstanceProgramVersionActionApi = (programVersionInfo, data) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let { courseId } = data
      let result = await programService.editCourseInstanceProgramVersion(programVersionInfo, courseId, data)
      if (result && result.data) {
        notifiFunction('success', result.data?.enMessage)
      }
      if(result && result.data?.code < 0) {
        notifiFunction('error', result.data?.enMessage)
      } 
      dispatch({
        type: CLOSE_FORM_COURSE_DRAWER,
      })
      dispatch(getCourseInstanceProgramVersionActionApi(programVersionInfo, 1))
      dispatch(getDirectCourseInstanceActionApi(1));
    } catch (err) {
      console.log("err", err);
      notifiFunction('error', 'Failed!' )
      dispatch({type: HIDE_LOADING})
    }
  };
};

// 13.4 Delete course Instance
export const deleteCourseInstanceProgramVersionActionApi = (programVersionInfo, data) => {
  return async (dispatch) => {
    try {
      let { courseId } = data
      let result = await programService.deleteCourseInstanceProgramVersion(programVersionInfo, courseId)
      if(result && result.data) {
        dispatch({
          type: CLOSE_FORM_COURSE_DRAWER,
        })
      }
      notifiFunction('success', 'Delete course successfully!')
      dispatch(getCourseInstanceProgramVersionActionApi(programVersionInfo, 1))
      dispatch(getDirectCourseInstanceActionApi(1));
    } catch(err) {
      notifiFunction('error', 'Delete course failed!')
      console.log('err', err);
    }
  }
}

// 13.5 Get courseId list for select

export const getCourseInstanceCourseIdsActionApi = (programVersionId) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let result = await programService.getCourseInstanceCourseIds(programVersionId)
      if (result && result.data) {
        dispatch({
          type: GET_COURSE_INSTANCE_IDS,
          payload: result.data.data
        })
      }
      dispatch({type: HIDE_LOADING})
    } catch (err) {
      console.log("err", err);
      dispatch({type: HIDE_LOADING})
    }
  };
};

// 14.1 Get course outcomes from course instance

export const getCourseOutcomesInCourseInstanceActionApi = (programInstanceId, courseId, page, pageSize = 10, searchObj = []) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let result = await programService.getCourseOutcomesInCourseInstance(programInstanceId, courseId, page, pageSize, searchObj)
      if (result && result.data) {
        dispatch({
          type: GET_COURSE_OUTCOMES_FROM_COURSE_INSTANCE,
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

// 14.2 post new course outcomes from course instance

export const postCourseOutcomsInCourseInstanceActionApi = (data) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let {programVersionInfo, courseId} = data
      let result = await programService.postCourseOutcomsInCourseInstance(programVersionInfo, courseId, data)
      if(result && result.data?.code > 0) {
        notifiFunction('success', result.data?.enMessage)
      } 
      if(result && result.data?.code < 0) {
        notifiFunction('error', result.data?.enMessage)
      }  
      dispatch({
        type: CLOSE_FORM_COURSE_DRAWER,
      })
      dispatch(getCourseOutcomesInCourseInstanceActionApi(programVersionInfo, courseId, 1))
      dispatch(getCourseOutcomesOutlineInCourseInstanceActionApi(programVersionInfo, courseId))
      dispatch({type: HIDE_LOADING})
    } catch(err) {
      dispatch({type: HIDE_LOADING})
      notifiFunction('error', 'Failed!' )
      console.log('err', err)
    }
  }
}

// 14.3 edit course outcomes from course instance

export const editCourseOutcomsInCourseInstanceActionApi = (data) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let {programVersionInfo, courseId, id} = data
      let result = await programService.editCourseOutcomsInCourseInstance(programVersionInfo, courseId, id, data)
      if (result && result.data) {
        notifiFunction('success', result.data?.enMessage)
      }
      if(result && result.data?.code < 0) {
        notifiFunction('error', result.data?.enMessage)
      } 
      dispatch({
        type: CLOSE_FORM_COURSE_DRAWER,
      })
      dispatch(getCourseOutcomesInCourseInstanceActionApi(programVersionInfo, courseId, 1))
      dispatch(getCourseOutcomesOutlineInCourseInstanceActionApi(programVersionInfo, courseId))
      dispatch({type: HIDE_LOADING})
    } catch (err) {
      console.log("err", err);
      notifiFunction('error', 'Failed!' )
      dispatch({type: HIDE_LOADING})
    }
  };
};

// 14.4 delete course outcomes from course instance

export const deleteCourseOutcomsInCourseInstanceActionApi = (data) => {
  return async (dispatch) => {
    try {
      let {programVersionInfo, courseId, id} = data
      let result = await programService.deleteCourseOutcomsInCourseInstance(programVersionInfo, courseId, id)
      if(result && result.data) {
        dispatch({
          type: CLOSE_FORM_COURSE_DRAWER,
        })
      }
      notifiFunction('success', 'Delete course successfully!')
      dispatch(getCourseOutcomesInCourseInstanceActionApi(programVersionInfo, courseId, 1))
      dispatch(getCourseOutcomesOutlineInCourseInstanceActionApi(programVersionInfo, courseId))
    } catch(err) {
      notifiFunction('error', 'Delete course failed!')
      console.log('err', err);
    }
  }
}

// 14.5 Get Parent Outcome autocomplete

export const getParentOutcomeAutocompleteInCourseInstanceActionApi = (programId, courseId) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let result = await programService.getParentOutcomeAutocompleteInCourseInstance(programId, courseId)
      if (result && result.data) {
        dispatch({
          type: GET_PARENT_ID_AUTOCOMPLETE_COURSE_INSTANCE,
          payload: result.data
        })
      }
      dispatch({type: HIDE_LOADING})
    } catch(err) {
      dispatch({type: HIDE_LOADING})
      console.log('err', err);
    }
  }
}

//  15. get matrix outcome-indicator

export const getMatrixOutcomesIndicatorActionApi = (programVersionInfo, courseId) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let result = await programService.getMatrixOutcomesIndicator(programVersionInfo, courseId)
      if (result && result.data) {
        dispatch({
          type: GET_MATRIX_OUTCOME_INDICATOR,
          payload: result.data
        })
      }
      dispatch({type: HIDE_LOADING})
    } catch(err) {
      dispatch({type: HIDE_LOADING})
      console.log('err', err);
    }
  }
}

// 15.1 post matrix out-indicator

export const postMatrixOutcomesIndicatorActionApi = (programVersionInfo, courseId, data) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let result = await programService.postMatrixOutcomesIndicator(programVersionInfo, courseId, data)
      if(result && result.data?.code > 0) {
        notifiFunction('success', result.data?.enMessage)
      } 
      if(result && result.data?.code < 0) {
        notifiFunction('error', result.data?.enMessage)
      }  
      dispatch(getMatrixOutcomesIndicatorActionApi(programVersionInfo, courseId))
      dispatch({type: HIDE_LOADING})
    } catch(err) {
      dispatch({type: HIDE_LOADING})
      notifiFunction('error', 'Failed!' )
      console.log('err', err)
    }
  }
}

// 16. Course instance outline

export const getCourseInstanceOutlineActionApi = (programVersionInfo, courseId) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let result = await programService.getCourseInstanceOutline(programVersionInfo, courseId)
      if (result && result.data) {
        dispatch({
          type: GET_COURSE_INSTANCE_OUTLINE,
          payload: result.data
        })
      }
      dispatch({type: HIDE_LOADING})
    } catch(err) {
      dispatch({type: HIDE_LOADING})
      console.log('err', err);
    }
  }
}

export const editCourseInstanceOutlineActionApi = (programVersionInfo, courseId, data) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let result = await programService.editCourseInstanceOutline(programVersionInfo, courseId, data)
      if(result && result.data?.code > 0) {
        notifiFunction('success', result.data?.enMessage)
      } 
      if(result && result.data?.code < 0) {
        notifiFunction('error', result.data?.enMessage)
      }  
      dispatch(getCourseInstanceOutlineActionApi(programVersionInfo, courseId))
      dispatch({type: HIDE_LOADING})
    } catch(err) {
      dispatch({type: HIDE_LOADING})
      notifiFunction('error', 'Failed!' )
      console.log('err', err)
    }
  }
}

// 17. Get course outcomes instance

export const getCourseOutcomesOutlineInCourseInstanceActionApi = (programVersionInfo, courseId) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let result = await programService.getCourseOutcomesOutlineInCourseInstance(programVersionInfo, courseId)
      if (result && result.data) {
        dispatch({
          type: GET_COURSE_OUTCOMES_FROM_INSTANCE_OUTLINE,
          payload: result.data
        })
      }
      dispatch({type: HIDE_LOADING})
    } catch(err) {
      dispatch({type: HIDE_LOADING})
      console.log('err', err);
    }
  }
}

// 18. Get outline details in course instance

export const getOutlineDetailFromCourseInstanceActionApi = (programVersionInfo, courseId ,type) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let result = await programService.getOutlineDetailFromCourseInstance(programVersionInfo, courseId, type)
      if (result && result.data) {
        dispatch({
          type: GET_OUTLINE_DETAIL_FROM_COURSE_INSTANCE,
          payload: result.data
        })
      }
      dispatch({type: HIDE_LOADING})
    } catch(err) {
      dispatch({type: HIDE_LOADING})
      console.log('err', err);
    }
  }
}

export const postOutlineDetailFromCourseInstanceActionApi = (data) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let {programVersionInfo, courseId} = data
      let result = await programService.postOutlineDetailFromCourseInstance(programVersionInfo, courseId, data)
      if(result && result.data?.code > 0) {
        notifiFunction('success', result.data?.enMessage)
      } 
      if(result && result.data?.code < 0) {
        notifiFunction('error', result.data?.enMessage)
      }  
      dispatch({
        type: CLOSE_FORM_COURSE_DRAWER,
      })
      dispatch(getOutlineDetailFromCourseInstanceActionApi(programVersionInfo, courseId ,1))
      dispatch({type: HIDE_LOADING})
    } catch(err) {
      dispatch({type: HIDE_LOADING})
      notifiFunction('error', 'Failed!' )
      console.log('err', err)
    }
  }
}

// 14.3 edit course outcomes from course instance

export const editOutlineDetailFromCourseInstanceActionApi = (data) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let {programVersionInfo, courseId, id} = data
      let result = await programService.editOutlineDetailFromCourseInstance(programVersionInfo, courseId, id, data)
      if (result && result.data) {
        notifiFunction('success', result.data?.enMessage)
      }
      if(result && result.data?.code < 0) {
        notifiFunction('error', result.data?.enMessage)
      } 
      dispatch({
        type: CLOSE_FORM_COURSE_DRAWER,
      })
      dispatch(getOutlineDetailFromCourseInstanceActionApi(programVersionInfo, courseId ,1))
      dispatch({type: HIDE_LOADING})
    } catch (err) {
      console.log("err", err);
      notifiFunction('error', 'Failed!' )
      dispatch({type: HIDE_LOADING})
    }
  };
};

// 14.4 delete course outcomes from course instance

export const deleteOutlineDetailFromCourseInstanceActionApi = (data) => {
  return async (dispatch) => {
    try {
      let {programVersionInfo, courseId, id} = data
      let result = await programService.deleteOutlineDetailFromCourseInstance(programVersionInfo, courseId, id)
      if(result && result.data) {
        dispatch({
          type: CLOSE_FORM_COURSE_DRAWER,
        })
      }
      notifiFunction('success', 'Delete course successfully!')
      dispatch(getOutlineDetailFromCourseInstanceActionApi(programVersionInfo, courseId ,1))
    } catch(err) {
      notifiFunction('error', 'Delete course failed!')
      console.log('err', err);
    }
  }
}

// 19. get all classes from course instance

export const getClassesFromCourseInstanceActionApi = (programVersionInfo, courseId, page, searchObj = []) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let result = await programService.getClassesFromCourseInstance(programVersionInfo, courseId, page, searchObj)
      if (result && result.data) {
        dispatch({
          type: GET_CLASSES_FROM_COURSE_INSTANCE,
          payload: result.data
        })
      }
      dispatch({type: HIDE_LOADING})
    } catch(err) {
      dispatch({type: HIDE_LOADING})
      console.log('err', err);
    }
  }
}

export const postClassesFromCourseInstanceActionApi = (data) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let {programVersionInfo, courseId} = data
      let result = await programService.postClassesFromCourseInstance(programVersionInfo, courseId, data)
      if(result && result.data?.code > 0) {
        notifiFunction('success', result.data?.enMessage)
      } 
      if(result && result.data?.code < 0) {
        notifiFunction('error', result.data?.enMessage)
      }  
      dispatch({
        type: CLOSE_FORM_COURSE_DRAWER,
      })
      dispatch(getClassesFromCourseInstanceActionApi(programVersionInfo, courseId ,1))
      dispatch({type: HIDE_LOADING})
    } catch(err) {
      dispatch({type: HIDE_LOADING})
      notifiFunction('error', 'Failed!' )
      console.log('err', err)
    }
  }
}

export const editClassesFromCourseInstanceActionApi = (data) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let {programVersionInfo, courseId, id} = data
      let result = await programService.editClassesFromCourseInstance(programVersionInfo, courseId, id, data)
      if (result && result.data) {
        notifiFunction('success', result.data?.enMessage)
      }
      if(result && result.data?.code < 0) {
        notifiFunction('error', result.data?.enMessage)
      } 
      dispatch({
        type: CLOSE_FORM_COURSE_DRAWER,
      })
      dispatch(getClassesFromCourseInstanceActionApi(programVersionInfo, courseId ,1))
      dispatch({type: HIDE_LOADING})
    } catch (err) {
      console.log("err", err);
      notifiFunction('error', 'Failed!' )
      dispatch({type: HIDE_LOADING})
    }
  };
};

export const deleteClassesFromCourseInstanceActionApi = (data) => {
  return async (dispatch) => {
    try {
      let {programVersionInfo, courseId, id} = data
      let result = await programService.deleteClassesFromCourseInstance(programVersionInfo, courseId, id)
      if(result && result.data) {
        dispatch({
          type: CLOSE_FORM_COURSE_DRAWER,
        })
      }
      notifiFunction('success', 'Delete course successfully!')
      dispatch(getClassesFromCourseInstanceActionApi(programVersionInfo, courseId ,1))
    } catch(err) {
      notifiFunction('error', 'Delete course failed!')
      console.log('err', err);
    }
  }
}

// 20 get class assessment

export const getVersionClassAssessmentActionApi = (classId, page, searchObj = []) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let result = await programService.getVersionClassAssessment(classId, page, searchObj)
      if (result && result.data) {
        dispatch({
          type: GET_VERSION_CLASS_ASSESSMENT,
          payload: result.data
        })
      }
      dispatch({type: HIDE_LOADING})
    } catch(err) {
      dispatch({type: HIDE_LOADING})
      console.log('err', err);
    }
  }
}


export const editVersionClassAssessmentActionApi = (data) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let {classId, courseOutcomeInstanceId} = data
      let result = await programService.editVersionClassAssessment(classId, courseOutcomeInstanceId, data)
      if (result && result.data) {
        notifiFunction('success', result.data?.enMessage)
      }
      dispatch({
        type: CLOSE_FORM_COURSE_DRAWER,
      })
      dispatch(getVersionClassAssessmentActionApi(classId, 1, []));
      dispatch({type: HIDE_LOADING})
    } catch (err) {
      console.log("err", err);
      notifiFunction('error', 'Failed!' )
      dispatch({type: HIDE_LOADING})
    }
  };
};

// 21 get version class student

export const getVersionClassStudentActionApi = (courseId, classId, page, searchObj = []) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let result = await programService.getVersionClassStudent(courseId, classId, page, searchObj)
      if (result && result.data) {
        dispatch({
          type: GET_VERSION_CLASS_STUDENT,
          payload: result.data
        })
      }
      dispatch({type: HIDE_LOADING})
    } catch(err) {
      dispatch({type: HIDE_LOADING})
      console.log('err', err);
    }
  }
}

export const postVersionClassStudentActionApi = (data) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let {courseId, classId, selectIds} = data
      let result = await programService.postVersionClassStudent(courseId, classId, selectIds)
      if(result && result.data?.code > 0) {
        notifiFunction('success', result.data?.enMessage)
      }  
      dispatch({
        type: CLOSE_FORM_COURSE_DRAWER,
      })
      dispatch(getVersionClassStudentActionApi(courseId, classId, 1, []))
      dispatch({type: HIDE_LOADING})
    } catch(err) {
      dispatch({type: HIDE_LOADING})
      notifiFunction('error', 'Failed!' )
      console.log('err', err)
    }
  }
}

export const deleteVersionClassStudentActionApi = (data) => {
  return async (dispatch) => {
    try {
      let {courseId, classId, studentId} = data
      let result = await programService.deleteVersionClassStudent(courseId, classId, studentId)
      if(result && result.data) {
        dispatch({
          type: CLOSE_FORM_COURSE_DRAWER,
        })
      }
      notifiFunction('success', 'Delete course successfully!')
      dispatch(getVersionClassStudentActionApi(courseId, classId, 1, []))
    } catch(err) {
      notifiFunction('error', 'Delete course failed!')
      console.log('err', err);
    }
  }
}

export const getAllStudentsActionApi = (page, size, classIdPrefix = undefined) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let result = await programService.getAllStudents(page, size, classIdPrefix)
      if (result && result.data) {
        dispatch({
          type: GET_ALL_STUDENTS,
          payload: result.data
        })
        dispatch({
          type: GET_SEARCH_STUDENTS,
          payload: result.data
        })
      }
      dispatch({type: HIDE_LOADING})
    } catch(err) {
      dispatch({type: HIDE_LOADING})
      console.log('err', err);
    }
  }
}

// get user

export const getUsersActionApi = (page, searchObj = []) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let result = await programService.getUsers(page, searchObj)
      if (result && result.data) {
        dispatch({
          type: GET_USERS,
          payload: result.data
        })
      }
      dispatch({type: HIDE_LOADING})
    } catch(err) {
      dispatch({type: HIDE_LOADING})
      console.log('err', err);
    }
  }
}

export const postUserActionApi = (data) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let result = await programService.postUser(data)
      if(result && result.data?.code > 0) {
        notifiFunction('success', result.data?.enMessage)
      } 
      dispatch({
        type: SET_IS_UPDATE_SUCCESS,
        payload: true
      }) 
      dispatch({
        type: CLOSE_FORM_COURSE_DRAWER,
      })
      dispatch(getUsersActionApi(1))
      dispatch({type: HIDE_LOADING})
    } catch(err) {
      dispatch({type: HIDE_LOADING})
      notifiFunction('error', 'Failed!' )
      dispatch({
        type: SET_IS_UPDATE_SUCCESS,
        payload: true
      })
      console.log('err', err)
    }
  }
}

export const editUserActionApi = (data) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let {id} = data
      let result = await programService.editUser(id, data)
      if (result && result.data) {
        notifiFunction('success', result.data?.enMessage)
      }
      dispatch({
        type: SET_IS_UPDATE_SUCCESS,
        payload: true
      })
      dispatch({
        type: CLOSE_FORM_COURSE_DRAWER,
      })
      dispatch(getUsersActionApi(1))
      dispatch({type: HIDE_LOADING})
    } catch (err) {
      console.log("err", err);
      notifiFunction('error', 'Failed!' )
      dispatch({
        type: SET_IS_UPDATE_SUCCESS,
        payload: true
      })
      dispatch({type: HIDE_LOADING})
    }
  };
};

export const deleteUserActionApi = (data) => {
  return async (dispatch) => {
    try {
      let {id} = data
      let result = await programService.deleteUser(id)
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
      dispatch(getUsersActionApi(1))
    } catch(err) {
      notifiFunction('error', 'Delete course failed!')
      dispatch({
        type: SET_IS_UPDATE_SUCCESS,
        payload: true
      })
      console.log('err', err);
    }
  }
}

// 22 get student

export const getStudentsActionApi = (page, searchObj = []) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let result = await programService.getStudents(page, searchObj)
      if (result && result.data) {
        dispatch({
          type: GET_STUDENTS,
          payload: result.data
        })
      }
      dispatch({type: HIDE_LOADING})
    } catch(err) {
      dispatch({type: HIDE_LOADING})
      console.log('err', err);
    }
  }
}

export const postStudentActionApi = (data) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let result = await programService.postStudent(data)
      if(result && result.data?.code > 0) {
        notifiFunction('success', result.data?.enMessage)
      } 
      dispatch({
        type: SET_IS_UPDATE_SUCCESS,
        payload: true
      }) 
      dispatch({
        type: CLOSE_FORM_COURSE_DRAWER,
      })
      dispatch(getStudentsActionApi(1))
      dispatch({type: HIDE_LOADING})
    } catch(err) {
      dispatch({type: HIDE_LOADING})
      notifiFunction('error', 'Failed!' )
      dispatch({
        type: SET_IS_UPDATE_SUCCESS,
        payload: true
      })
      console.log('err', err)
    }
  }
}

export const editStudentActionApi = (data) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let {id} = data
      let result = await programService.editStudent(id, data)
      if (result && result.data) {
        notifiFunction('success', result.data?.enMessage)
      }
      dispatch({
        type: SET_IS_UPDATE_SUCCESS,
        payload: true
      })
      dispatch({
        type: CLOSE_FORM_COURSE_DRAWER,
      })
      dispatch(getStudentsActionApi(1))
      dispatch({type: HIDE_LOADING})
    } catch (err) {
      console.log("err", err);
      notifiFunction('error', 'Failed!' )
      dispatch({
        type: SET_IS_UPDATE_SUCCESS,
        payload: true
      })
      dispatch({type: HIDE_LOADING})
    }
  };
};

export const deleteStudentActionApi = (data) => {
  return async (dispatch) => {
    try {
      let {id} = data
      let result = await programService.deleteStudent(id)
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
      dispatch(getStudentsActionApi(1))
    } catch(err) {
      notifiFunction('error', 'Delete course failed!')
      dispatch({
        type: SET_IS_UPDATE_SUCCESS,
        payload: true
      })
      console.log('err', err);
    }
  }
}

// 23 get lecturer

export const getLecturersActionApi = (page, searchObj = []) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let result = await programService.getLecturers(page, searchObj)
      if (result && result.data) {
        dispatch({
          type: GET_LECTURERS,
          payload: result.data
        })
      }
      dispatch({type: HIDE_LOADING})
    } catch(err) {
      dispatch({type: HIDE_LOADING})
      console.log('err', err);
    }
  }
}

export const postLecturerActionApi = (data) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let result = await programService.postLecturer(data)
      if(result && result.data?.code > 0) {
        notifiFunction('success', result.data?.enMessage);
      }  
      dispatch({
        type: SET_IS_UPDATE_SUCCESS,
        payload: true
      })
      dispatch({
        type: CLOSE_FORM_COURSE_DRAWER,
      })
      dispatch(getLecturersActionApi(1))
      dispatch({type: HIDE_LOADING})
    } catch(err) {
      dispatch({type: HIDE_LOADING})
      notifiFunction('error', 'Failed!' )
      dispatch({
        type: SET_IS_UPDATE_SUCCESS,
        payload: false
      })
      console.log('err', err)
    }
  }
}

export const editLecturerActionApi = (data) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let {id} = data
      let result = await programService.editLecturer(id, data)
      if (result && result.data) {
        notifiFunction('success', result.data?.enMessage)
      }
      dispatch({
        type: SET_IS_UPDATE_SUCCESS,
        payload: true
      })
      dispatch({
        type: CLOSE_FORM_COURSE_DRAWER,
      })
      dispatch(getLecturersActionApi(1))
      dispatch({type: HIDE_LOADING})
    } catch (err) {
      console.log("err", err);
      notifiFunction('error', 'Failed!' )
      dispatch({type: HIDE_LOADING})
      dispatch({
        type: SET_IS_UPDATE_SUCCESS,
        payload: false
      })
    }
  };
};

export const deleteLecturerActionApi = (data) => {
  return async (dispatch) => {
    try {
      let {id} = data
      let result = await programService.deleteLecturer(id)
      if(result && result.data) {
        dispatch({
          type: CLOSE_FORM_COURSE_DRAWER,
        });
        dispatch({
          type: SET_IS_UPDATE_SUCCESS,
          payload: true
        });
      }
      notifiFunction('success', 'Delete course successfully!')
      dispatch(getLecturersActionApi(1))
    } catch(err) {
      notifiFunction('error', 'Delete course failed!')
      console.log('err', err);
      dispatch({
        type: SET_IS_UPDATE_SUCCESS,
        payload: false
      })
    }
  }
}

// 26 get direct course instance

export const getDirectCourseInstanceActionApi = (page, searchObj = []) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let result = await programService.getDirectCourseInstance(page, searchObj)
      if (result && result.data) {
        dispatch({
          type: GET_DIRECT_COURSE_INSTANCE,
          payload: result.data
        })
      }
      dispatch({type: HIDE_LOADING})
    } catch(err) {
      dispatch({type: HIDE_LOADING})
      console.log('err', err);
    }
  }
}

// 27 get all programversioinfo autocomplete

export const getProgramInfoListActionApi = () => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let result = await programService.getProgramInfoList()
      if (result && result.data) {
        dispatch({
          type: GET_PROGRAM_INFO,
          payload: result.data.data
        })
      }
      dispatch({type: HIDE_LOADING})
    } catch(err) {
      dispatch({type: HIDE_LOADING})
      console.log('err', err);
    }
  }
}

// 28 test from course instance

export const getVersionCourseInstanceTestActionApi = (programVersionInfo, courseId, page, searchObj = []) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let result = await programService.getVersionCourseInstanceTest(programVersionInfo, courseId, page, searchObj)
      if (result && result.data) {
        dispatch({
          type: GET_VERSION_COURSE_INSTANCE_TEST,
          payload: result.data
        })
      }
      dispatch({type: HIDE_LOADING})
    } catch(err) {
      dispatch({type: HIDE_LOADING})
      console.log('err', err);
    }
  }
}

export const postVersionCourseInstanceTestActionApi = (data) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let { programVersionInfo, courseId } = data
      let result = await programService.postVersionCourseInstanceTest(programVersionInfo, courseId, data)
      if(result && result.data?.code > 0) {
        notifiFunction('success', result.data?.enMessage)
      }  
      dispatch({
        type: CLOSE_FORM_COURSE_DRAWER,
      })
      dispatch(getVersionCourseInstanceTestActionApi(programVersionInfo, courseId, 1, []))
      dispatch({type: HIDE_LOADING})
    } catch(err) {
      dispatch({type: HIDE_LOADING})
      notifiFunction('error', 'Failed!' )
      console.log('err', err)
    }
  }
}

export const editVersionCourseInstanceTestActionApi = (data) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let { programVersionInfo, courseId, id } = data
      let result = await programService.editVersionCourseInstanceTest(programVersionInfo, courseId, id, data)
      if (result && result.data) {
        notifiFunction('success', result.data?.enMessage)
      }
      dispatch({
        type: CLOSE_FORM_COURSE_DRAWER,
      })
      dispatch(getVersionCourseInstanceTestActionApi(programVersionInfo, courseId, 1, []))
      dispatch({type: HIDE_LOADING})
    } catch (err) {
      console.log("err", err);
      notifiFunction('error', 'Failed!' )
      dispatch({type: HIDE_LOADING})
    }
  };
};

export const deleteVersionCourseInstanceTestActionApi = (data) => {
  return async (dispatch) => {
    try {
      let { programVersionInfo, courseId, id } = data
      let result = await programService.deleteVersionCourseInstanceTest(programVersionInfo, courseId, id)
      if(result && result.data) {
        dispatch({
          type: CLOSE_FORM_COURSE_DRAWER,
        })
      }
      notifiFunction('success', 'Delete course successfully!')
      dispatch(getVersionCourseInstanceTestActionApi(programVersionInfo, courseId, 1, []))
    } catch(err) {
      notifiFunction('error', 'Delete course failed!')
      console.log('err', err);
    }
  }
}

// 29 course-outcome from test from course instance

export const getVersionCourseInstanceTestOutcomeActionApi = (testId, page, pageSize, searchObj = []) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let result = await programService.getVersionCourseInstanceTestOutcome(testId, page, pageSize ,searchObj)
      if (result && result.data) {
        dispatch({
          type: GET_VERSION_COURSE_INSTANCE_TEST_COURSE_OUTCOME,
          payload: result.data
        })
      }
      dispatch({type: HIDE_LOADING})
    } catch(err) {
      dispatch({type: HIDE_LOADING})
      console.log('err', err);
    }
  }
}

export const postVersionCourseInstanceTestOutcomeActionApi = (data) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let { testId } = data
      let result = await programService.postVersionCourseInstanceTestOutcome(testId, data)
      if(result && result.data?.code > 0) {
        notifiFunction('success', result.data?.enMessage)
      }  
      dispatch({
        type: CLOSE_FORM_COURSE_DRAWER,
      })
      dispatch(getVersionCourseInstanceTestOutcomeActionApi(testId, 1))
      dispatch({type: HIDE_LOADING})
    } catch(err) {
      dispatch({type: HIDE_LOADING})
      notifiFunction('error', 'Failed!' )
      console.log('err', err)
    }
  }
}

export const editVersionCourseInstanceTestOutcomeActionApi = (data) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let { testId, id } = data
      let result = await programService.editVersionCourseInstanceTestOutcome(testId, id, data)
      if (result && result.data) {
        notifiFunction('success', result.data?.enMessage)
      }
      dispatch({
        type: CLOSE_FORM_COURSE_DRAWER,
      })
      dispatch(getVersionCourseInstanceTestOutcomeActionApi(testId, 1))
      dispatch({type: HIDE_LOADING})
    } catch (err) {
      console.log("err", err);
      notifiFunction('error', 'Failed!' )
      dispatch({type: HIDE_LOADING})
    }
  };
};

export const deleteVersionCourseInstanceTestOutcomeActionApi = (data) => {
  return async (dispatch) => {
    try {
      let { testId, id } = data
      let result = await programService.deleteVersionCourseInstanceTestOutcome(testId, id)
      if(result && result.data) {
        dispatch({
          type: CLOSE_FORM_COURSE_DRAWER,
        })
      }
      notifiFunction('success', 'Delete course successfully!')
      dispatch(getVersionCourseInstanceTestOutcomeActionApi(testId, 1))
    } catch(err) {
      notifiFunction('error', 'Delete course failed!')
      console.log('err', err);
    }
  }
}

// 30 question from test from course instance

export const getVersionCourseInstanceTestQuestionActionApi = (testId, page, searchObj = []) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let result = await programService.getVersionCourseInstanceTestQuestion(testId, page, searchObj)
      if (result && result.data) {
        dispatch({
          type: GET_VERSION_COURSE_INSTANCE_TEST_QUESTION,
          payload: result.data
        })
      }
      dispatch({type: HIDE_LOADING})
    } catch(err) {
      dispatch({type: HIDE_LOADING})
      console.log('err', err);
    }
  }
}
// course instance => test 
// course instance => class => test 
export const postVersionCourseInstanceTestQuestionActionApi = (data) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let { testId, classId } = data
      let result = await programService.postVersionCourseInstanceTestQuestion(testId, data)
      if(result && result.data?.code > 0) {
        notifiFunction('success', result.data?.enMessage)
      }  
      dispatch({
        type: CLOSE_FORM_COURSE_DRAWER,
      })
      dispatch(getVersionCourseInstanceTestQuestionActionApi(testId, 1))
      dispatch(getVersionCourseInstanceClassTestQuestionActionApi(classId, testId, 1))
      dispatch({type: HIDE_LOADING})
    } catch(err) {
      dispatch({type: HIDE_LOADING})
      notifiFunction('error', 'Failed!' )
      console.log('err', err)
    }
  }
}

export const editVersionCourseInstanceTestQuestionActionApi = (data) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let { testId, id, classId } = data
      let result = await programService.editVersionCourseInstanceTestQuestion(testId, id, data)
      if (result && result.data) {
        notifiFunction('success', result.data?.enMessage)
      }
      dispatch({
        type: CLOSE_FORM_COURSE_DRAWER,
      })
      dispatch(getVersionCourseInstanceTestQuestionActionApi(testId, 1))
      dispatch(getVersionCourseInstanceClassTestQuestionActionApi(classId, testId, 1))
      dispatch({type: HIDE_LOADING})
    } catch (err) {
      console.log("err", err);
      notifiFunction('error', 'Failed!' )
      dispatch({type: HIDE_LOADING})
    }
  };
};

export const deleteVersionCourseInstanceTestQuestionActionApi = (data) => {
  return async (dispatch) => {
    try {
      let { testId, id, classId } = data
      let result = await programService.deleteVersionCourseInstanceTestQuestion(testId, id)
      if(result && result.data) {
        dispatch({
          type: CLOSE_FORM_COURSE_DRAWER,
        })
      }
      notifiFunction('success', 'Delete course successfully!')
      dispatch(getVersionCourseInstanceTestQuestionActionApi(testId, 1))
      dispatch(getVersionCourseInstanceClassTestQuestionActionApi(classId, testId, 1))
    } catch(err) {
      notifiFunction('error', 'Delete course failed!')
      console.log('err', err);
    }
  }
}

// 31 question outcome from test from course instance

export const postVersionCourseInstanceTestQuestionOutcomeActionApi = (data) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let { questionId, testId, classId } = data
      let { id, ...restObject } = data;
      let result = await programService.postVersionCourseInstanceTestQuestionOutcome(questionId, restObject)
      if(result && result.data?.code > 0) {
        notifiFunction('success', result.data?.enMessage)
      }  
      dispatch({
        type: CLOSE_FORM_COURSE_DRAWER,
      })
      dispatch(getVersionCourseInstanceTestQuestionActionApi(testId, 1))
      dispatch(getVersionCourseInstanceClassTestQuestionActionApi(classId, testId, 1))
      dispatch({type: HIDE_LOADING})
    } catch(err) {
      dispatch({type: HIDE_LOADING})
      notifiFunction('error', 'Failed!' )
      console.log('err', err)
    }
  }
}

export const editVersionCourseInstanceTestQuestionOutcomeActionApi = (data) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let { testId, id, questionId, classId } = data
      let result = await programService.editVersionCourseInstanceTestQuestionOutcome(questionId, id, data)
      if (result && result.data) {
        notifiFunction('success', result.data?.enMessage)
      }
      dispatch({
        type: CLOSE_FORM_COURSE_DRAWER,
      })
      dispatch(getVersionCourseInstanceTestQuestionActionApi(testId, 1))
      dispatch(getVersionCourseInstanceClassTestQuestionActionApi(classId, testId, 1))
      dispatch({type: HIDE_LOADING})
    } catch (err) {
      console.log("err", err);
      notifiFunction('error', 'Failed!' )
      dispatch({type: HIDE_LOADING})
    }
  };
};

export const deleteVersionCourseInstanceTestQuestionOutcomeActionApi = (data) => {
  return async (dispatch) => {
    try {
      let { testId, id, questionId, classId } = data
      let result = await programService.deleteVersionCourseInstanceTestQuestionOutcome(questionId, id)
      if(result && result.data) {
        dispatch({
          type: CLOSE_FORM_COURSE_DRAWER,
        })
      }
      notifiFunction('success', 'Delete course successfully!')
      dispatch(getVersionCourseInstanceTestQuestionActionApi(testId, 1))
      dispatch(getVersionCourseInstanceClassTestQuestionActionApi(classId, testId, 1))
    } catch(err) {
      notifiFunction('error', 'Delete course failed!')
      console.log('err', err);
    }
  }
}

// 32 question from test from class

export const getVersionCourseInstanceClassTestQuestionActionApi = (classId, testId, page, size, searchObj = []) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let result = await programService.getVersionCourseInstanceClassTestQuestion(classId, testId, page, size, searchObj)
      if (result && result.data) {
        dispatch({
          type: GET_VERSION_COURSE_INSTANCE_CALSS_TEST_QUESTION,
          payload: result.data
        })
      }
      dispatch({type: HIDE_LOADING})
    } catch(err) {
      dispatch({type: HIDE_LOADING})
      console.log('err', err);
    }
  }
}

// Version thesis

export const getVersionThesisActionApi = (programVersionInfo, page, searchObj = []) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let result = await programService.getVersionThesis(programVersionInfo, page, searchObj)
      if (result && result.data) {
        dispatch({
          type: GET_VERSION_THESIS,
          payload: result.data
        })
      }
      dispatch({type: HIDE_LOADING})
    } catch(err) {
      dispatch({type: HIDE_LOADING})
      console.log('err', err);
    }
  }
}

export const postVersionThesisActionApi = (data) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let {programVersionInfo} = data
      let result = await programService.postVersionThesis(programVersionInfo, data)
      if(result && result.data?.code > 0) {
        notifiFunction('success', result.data?.enMessage)
      }  
      dispatch({
        type: CLOSE_FORM_COURSE_DRAWER,
      })
      dispatch(getVersionThesisActionApi(programVersionInfo, 1))
      dispatch({type: HIDE_LOADING})
    } catch(err) {
      dispatch({type: HIDE_LOADING})
      notifiFunction('error', 'Failed!' )
      console.log('err', err)
    }
  }
}

export const editVersionThesisActionApi = (data) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let {programVersionInfo, projectId} = data
      let result = await programService.editVersionThesis(programVersionInfo, projectId, data)
      if (result && result.data) {
        notifiFunction('success', result.data?.enMessage)
      }
      dispatch({
        type: CLOSE_FORM_COURSE_DRAWER,
      })
      dispatch(getVersionThesisActionApi(programVersionInfo, 1))
      dispatch({type: HIDE_LOADING})
    } catch (err) {
      console.log("err", err);
      notifiFunction('error', 'Failed!' )
      dispatch({type: HIDE_LOADING})
    }
  };
};

export const deleteVersionThesisActionApi = (data) => {
  return async (dispatch) => {
    try {
      let {programVersionInfo, projectId} = data
      let result = await programService.deleteVersionThesis(programVersionInfo, projectId)
      if(result && result.data) {
        dispatch({
          type: CLOSE_FORM_COURSE_DRAWER,
        })
      }
      notifiFunction('success', 'Delete course successfully!')
      dispatch(getVersionThesisActionApi(programVersionInfo, 1))
    } catch(err) {
      notifiFunction('error', 'Delete course failed!')
      console.log('err', err);
    }
  }
}

// 34 version thesis lecturer

export const postVersionThesisLecturerActionApi = (data) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let {programVersionInfo, projectId} = data
      let result = await programService.postVersionThesisLecturer(programVersionInfo, projectId, data)
      if(result && result.data?.code > 0) {
        notifiFunction('success', result.data?.enMessage)
      }  
      dispatch({
        type: CLOSE_FORM_COURSE_DRAWER,
      })
      dispatch(getVersionThesisActionApi(programVersionInfo, 1))
      dispatch({type: HIDE_LOADING})
    } catch(err) {
      dispatch({type: HIDE_LOADING})
      notifiFunction('error', 'Failed!' )
      console.log('err', err)
    }
  }
}

export const editVersionThesisLecturerActionApi = (data) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let {programVersionInfo, projectId, id} = data
      let result = await programService.editVersionThesisLecturer(programVersionInfo, projectId, id, data)
      if (result && result.data) {
        notifiFunction('success', result.data?.enMessage)
      }
      dispatch({
        type: CLOSE_FORM_COURSE_DRAWER,
      })
      dispatch(getVersionThesisActionApi(programVersionInfo, 1))
      dispatch({type: HIDE_LOADING})
    } catch (err) {
      console.log("err", err);
      notifiFunction('error', 'Failed!' )
      dispatch({type: HIDE_LOADING})
    }
  };
};

export const deleteVersionThesisLecturerActionApi = (data) => {
  return async (dispatch) => {
    try {
      let {programVersionInfo, projectId, id} = data
      let result = await programService.deleteVersionThesisLecturer(programVersionInfo,  projectId, id)
      if(result && result.data) {
        dispatch({
          type: CLOSE_FORM_COURSE_DRAWER,
        })
      }
      notifiFunction('success', 'Delete course successfully!')
      dispatch(getVersionThesisActionApi(programVersionInfo, 1))
    } catch(err) {
      notifiFunction('error', 'Delete course failed!')
      console.log('err', err);
    }
  }
}

// 35 version survey

export const getVersionSurveyActionApi = (programVersionInfo, page, searchObj = []) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let result = await programService.getVersionSurvey(programVersionInfo, page, searchObj)
      if (result && result.data) {
        dispatch({
          type: GET_VERSION_SURVEY,
          payload: result.data
        })
      }
      dispatch({type: HIDE_LOADING})
    } catch(err) {
      dispatch({type: HIDE_LOADING})
      console.log('err', err);
    }
  }
}

export const postVersionSurveyActionApi = (data) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let {programVersionInfo} = data
      let result = await programService.postVersionSurvey(programVersionInfo, data)
      if(result && result.data?.code > 0) {
        notifiFunction('success', result.data?.enMessage)
      }  
      dispatch({
        type: CLOSE_FORM_COURSE_DRAWER,
      })
      dispatch({
        type: SET_IS_UPDATE_SUCCESS,
        payload: true
      })
      dispatch(getVersionSurveyActionApi(programVersionInfo, 1))
      dispatch(getSurveysActionApi(1))
      dispatch({type: HIDE_LOADING})
    } catch(err) {
      dispatch({type: HIDE_LOADING})
      notifiFunction('error', 'Failed!' )
      console.log('err', err)
      dispatch({
        type: SET_IS_UPDATE_SUCCESS,
        payload: false
      })
    }
  }
}

export const editVersionSurveyActionApi = (data) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let {programVersionInfo, name} = data
      let result = await programService.editVersionSurvey(programVersionInfo, name, data)
      if (result && result.data) {
        notifiFunction('success', result.data?.enMessage)
      }
      dispatch({
        type: CLOSE_FORM_COURSE_DRAWER,
      })
      dispatch({
        type: SET_IS_UPDATE_SUCCESS,
        payload: true
      })
      dispatch(getVersionSurveyActionApi(programVersionInfo, 1))
      dispatch(getSurveysActionApi(1))
      dispatch({type: HIDE_LOADING})
    } catch (err) {
      console.log("err", err);
      notifiFunction('error', 'Failed!' )
      dispatch({type: HIDE_LOADING})
      dispatch({
        type: SET_IS_UPDATE_SUCCESS,
        payload: false
      })
    }
  };
};

export const deleteVersionSurveyActionApi = (data) => {
  return async (dispatch) => {
    try {
      let {programVersionInfo, name} = data
      let result = await programService.deleteVersionSurvey(programVersionInfo, name)
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
      dispatch(getVersionSurveyActionApi(programVersionInfo, 1))
      dispatch(getSurveysActionApi(1))
    } catch(err) {
      notifiFunction('error', 'Delete course failed!')
      console.log('err', err);
      dispatch({
        type: SET_IS_UPDATE_SUCCESS,
        payload: false
      })
    }
  }
}

export const getSurveysActionApi = (page, searchObj = []) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let result = await programService.getSurveys(page, searchObj)
      if (result && result.data) {
        dispatch({
          type: GET_SURVEYS,
          payload: result.data
        })
      }
      dispatch({type: HIDE_LOADING})
    } catch(err) {
      dispatch({type: HIDE_LOADING})
      console.log('err', err);
    }
  }
}

// survey question

export const getVersionSurveyQuestionActionApi = (programVersionInfo, surveyName, page, searchObj = []) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let result = await programService.getVersionSurveyQuestion(programVersionInfo, surveyName, page, searchObj)
      if (result && result.data) {
        dispatch({
          type: GET_VERSION_SURVEY_QUESTION,
          payload: result.data
        })
      }
      dispatch({type: HIDE_LOADING})
    } catch(err) {
      dispatch({type: HIDE_LOADING})
      console.log('err', err);
    }
  }
}

export const postVersionSurveyQuestionActionApi = (data) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let {programVersionInfo, surveyName} = data
      let result = await programService.postVersionSurveyQuestion(programVersionInfo, surveyName, data)
      if(result && result.data?.code > 0) {
        notifiFunction('success', result.data?.enMessage)
      }  
      dispatch({
        type: CLOSE_FORM_COURSE_DRAWER,
      })
      dispatch(getVersionSurveyQuestionActionApi(programVersionInfo, surveyName, 1))
      dispatch({type: HIDE_LOADING})
    } catch(err) {
      dispatch({type: HIDE_LOADING})
      notifiFunction('error', 'Failed!' )
      console.log('err', err)
    }
  }
}

export const editVersionSurveyQuestionActionApi = (data) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let {programVersionInfo, surveyName, id} = data
      let result = await programService.editVersionSurveyQuestion(programVersionInfo, surveyName, id, data)
      if (result && result.data) {
        notifiFunction('success', result.data?.enMessage)
      }
      dispatch({
        type: CLOSE_FORM_COURSE_DRAWER,
      })
      dispatch(getVersionSurveyQuestionActionApi(programVersionInfo, surveyName, 1))
      dispatch({type: HIDE_LOADING})
    } catch (err) {
      console.log("err", err);
      notifiFunction('error', 'Failed!' )
      dispatch({type: HIDE_LOADING})
    }
  };
};

export const deleteVersionSurveyQuestionActionApi = (data) => {
  return async (dispatch) => {
    try {
      let {programVersionInfo, surveyName, id} = data
      let result = await programService.deleteVersionSurveyQuestion(programVersionInfo, surveyName, id)
      if(result && result.data) {
        dispatch({
          type: CLOSE_FORM_COURSE_DRAWER,
        })
      }
      notifiFunction('success', 'Delete course successfully!')
      dispatch(getVersionSurveyQuestionActionApi(programVersionInfo, surveyName, 1))
    } catch(err) {
      notifiFunction('error', 'Delete course failed!')
      console.log('err', err);
    }
  }
}

export const getAllOutcomeListActionApi = (programId) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let result = await programService.getAllOutcomeList(programId)
      if (result && result.data) {
        dispatch({
          type: GET_ALL_OUTCOME_LIST,
          payload: result.data
        })
      }
      dispatch({type: HIDE_LOADING})
    } catch(err) {
      dispatch({type: HIDE_LOADING})
      console.log('err', err);
    }
  }
}

export const postVersionSurveyQuestionAnswerActionApi = (data) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let {programVersionInfo, surveyName, id} = data
      let result = await programService.postVersionSurveyQuestionAnswer(programVersionInfo, surveyName, id, data)
      if(result && result.data?.code > 0) {
        notifiFunction('success', result.data?.enMessage)
      }  
      dispatch({
        type: CLOSE_FORM_COURSE_DRAWER,
      })
      dispatch(getVersionSurveyQuestionActionApi(programVersionInfo, surveyName, 1))
      dispatch({type: HIDE_LOADING})
    } catch(err) {
      dispatch({type: HIDE_LOADING})
      notifiFunction('error', 'Failed!' )
      console.log('err', err)
    }
  }
}

export const editVersionSurveyQuestionAnswerActionApi = (data) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let {programVersionInfo, surveyName, id, levelId} = data
      let result = await programService.editVersionSurveyQuestionAnswer(programVersionInfo, surveyName, id, levelId, data)
      if (result && result.data) {
        notifiFunction('success', result.data?.enMessage)
      }
      dispatch({
        type: CLOSE_FORM_COURSE_DRAWER,
      })
      dispatch(getVersionSurveyQuestionActionApi(programVersionInfo, surveyName, 1))
      dispatch({type: HIDE_LOADING})
    } catch (err) {
      console.log("err", err);
      notifiFunction('error', 'Failed!' )
      dispatch({type: HIDE_LOADING})
    }
  };
};

export const deleteVersionSurveyQuestionAnswerActionApi = (data) => {
  return async (dispatch) => {
    try {
      let {programVersionInfo, surveyName, id, levelId} = data
      let result = await programService.deleteVersionSurveyQuestionAnswer(programVersionInfo, surveyName, id, levelId)
      if(result && result.data) {
        dispatch({
          type: CLOSE_FORM_COURSE_DRAWER,
        })
      }
      notifiFunction('success', 'Delete course successfully!')
      dispatch(getVersionSurveyQuestionActionApi(programVersionInfo, surveyName, 1))
    } catch(err) {
      notifiFunction('error', 'Delete course failed!')
      console.log('err', err);
    }
  }
}

 // foundation test question

 export const getVersionFoundationTestSubjectActionApi = (programVersionInfo, page, size, searchObj = []) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let result = await programService.getVersionFoundationTestSubject(programVersionInfo, page, size, searchObj)
      if (result && result.data) {
        dispatch({
          type: GET_VERSION_FOUNDATION_TEST_SUBJECTS,
          payload: result.data
        })
      }
      dispatch({type: HIDE_LOADING})
    } catch(err) {
      dispatch({type: HIDE_LOADING})
      console.log('err', err);
    }
  }
}

export const postVersionFoundationTestSubjectActionApi = (data) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let {selectIds, programVersionInfo} = data
      let result = await programService.postVersionFoundationTestSubject(programVersionInfo, selectIds)
      if(result && result.data?.code > 0) {
        notifiFunction('success', result.data?.enMessage)
      }  
      dispatch({
        type: CLOSE_FORM_COURSE_DRAWER,
      })
      dispatch(getVersionFoundationTestSubjectActionApi(programVersionInfo, 1, 500, []))
      dispatch({type: HIDE_LOADING})
    } catch(err) {
      dispatch({type: HIDE_LOADING})
      notifiFunction('error', 'Failed!' )
      console.log('err', err)
    }
  }
}

export const deleteVersionFoundationTestSubjectActionApi = (data) => {
  return async (dispatch) => {
    try {
      let {programVersionInfo, id} = data
      let result = await programService.deleteVersionFoundationTestSubject(programVersionInfo, id)
      if(result && result.data) {
        dispatch({
          type: CLOSE_FORM_COURSE_DRAWER,
        })
      }
      notifiFunction('success', 'Delete course successfully!')
      dispatch(getVersionFoundationTestSubjectActionApi(programVersionInfo, 1, 500, []))
    } catch(err) {
      notifiFunction('error', 'Delete course failed!')
      console.log('err', err);
    }
  }
}

export const getSubjectsActionApi = (page, size) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let result = await programService.getSubjects(page, size)
      if (result && result.data) {
        dispatch({
          type: GET_ALL_SUBJECTS,
          payload: result.data
        })
      }
      dispatch({type: HIDE_LOADING})
    } catch(err) {
      dispatch({type: HIDE_LOADING})
      console.log('err', err);
    }
  }
}

// foundation test question

export const getVersionFoundationTestQuestionActionApi = (programVersionInfo,  page, size, searchObj = []) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let result = await programService.getVersionFoundationTestQuestion(programVersionInfo,  page, size, searchObj)
      if (result && result.data) {
        dispatch({
          type: GET_VERSION_FOUNDATION_TEST_QUESTIONS,
          payload: result.data
        })
      }
      dispatch({type: HIDE_LOADING})
    } catch(err) {
      dispatch({type: HIDE_LOADING})
      console.log('err', err);
    }
  }
}

export const postVersionFoundationTestQuestionActionApi = (data) => {
  return async (dispatch) => {
    try {
      let formData = new FormData();
      let {programVersionInfo, name, content, percent, outcomeName, indicatorName, level, image, lecturerId, subjectId, time} = data
      formData.append('name', name);
      formData.append('content', content);
      formData.append('percent', percent);
      formData.append('outcomeName', outcomeName);
      formData.append('indicatorName', indicatorName);
      formData.append('level', level);
      formData.append('image', image);
      formData.append('lecturerId', lecturerId);
      formData.append('subjectId', subjectId);
      formData.append('time', time);
      let result = await programService.postVersionFoundationTestQuestion(programVersionInfo, formData)
      if(result && result.data?.code > 0) {
        notifiFunction('success', result.data?.enMessage)
      } 
      if(result && result.data?.code < 0) {
        notifiFunction('error', result.data?.enMessage)
      }  
      dispatch({
        type: CLOSE_FORM_COURSE_DRAWER,
      })
      dispatch(getVersionFoundationTestQuestionActionApi(programVersionInfo,  1, 1000))
    } catch(err) {
      notifiFunction('error', 'Post question failed!')
      console.log('err', err)
    }
  }
}

export const editVersionFoundationTestQuestionActionApi = (data) => {
  return async (dispatch) => {
    try {
      let formData = new FormData();
      let {id, programVersionInfo, name, content, percent, outcomeName, indicatorName, level, image, lecturerId, subjectId, time} = data
      formData.append('name', name);
      formData.append('content', content);
      formData.append('percent', percent);
      formData.append('outcomeName', outcomeName);
      formData.append('indicatorName', indicatorName);
      formData.append('level', level);
      formData.append('image', image);
      formData.append('lecturerId', lecturerId);
      formData.append('subjectId', subjectId);
      formData.append('time', time);
      let result = await programService.editVersionFoundationTestQuestion(programVersionInfo, formData, id)
      if(result && result.data?.code > 0) {
        notifiFunction('success', result.data?.enMessage)
      } 
      if(result && result.data?.code < 0) {
        notifiFunction('error', result.data?.enMessage)
      } 
      dispatch({
        type: CLOSE_FORM_COURSE_DRAWER,
      }) 
      dispatch(getVersionFoundationTestQuestionActionApi(programVersionInfo,  1, 1000))
    } catch(err) {
      notifiFunction('error', 'Edit question failed!')
      console.log('err', err)
    }
  }
}

export const deleteVersionFoundationTestQuestionActionApi = (data) => {
  return async (dispatch) => {
    try {
      let {programVersionInfo, id} = data
      let result = await programService.deleteVersionFoundationTestQuestion(programVersionInfo, id)
      if(result && result.data) {
        dispatch({
          type: CLOSE_FORM_COURSE_DRAWER,
        })
      }
      notifiFunction('success', 'Delete course successfully!')
      dispatch(getVersionFoundationTestQuestionActionApi(programVersionInfo,  1, 1000))
    } catch(err) {
      notifiFunction('error', 'Delete course failed!')
      console.log('err', err);
    }
  }
}

export const getAllIndicatorsByOutcomeListActionApi = (programId, outcomeName, page, size) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let result = await programService.getAllIndicatorsByOutcomeList(programId, outcomeName, page, size)
      if (result && result.data) {
        dispatch({
          type: GET_ALL_INDICATOR_BY_OUTCOME_NAME,
          payload: result.data
        })
      }
      dispatch({type: HIDE_LOADING})
    } catch(err) {
      dispatch({type: HIDE_LOADING})
      console.log('err', err);
    }
  }
}

// foundation test question answer

export const postVersionFoundationTestQuestionAnswerActionApi = (data) => {
  return async (dispatch) => {
    try {
      let formData = new FormData();
      let {questionId, programVersionInfo, answerId, description, image} = data
      formData.append('image', image);
      formData.append('answerId', answerId);
      formData.append('description', description);
      let result = await programService.postVersionFoundationTestQuestionAnswer(programVersionInfo, formData, questionId)
      if(result && result.data?.code > 0) {
        notifiFunction('success', result.data?.enMessage)
      } 
      if(result && result.data?.code < 0) {
        notifiFunction('error', result.data?.enMessage)
      }  
      dispatch({
        type: CLOSE_FORM_COURSE_DRAWER,
      })
      dispatch(getVersionFoundationTestQuestionActionApi(programVersionInfo,  1, 1000))
    } catch(err) {
      notifiFunction('error', 'Post question failed!')
      console.log('err', err)
    }
  }
}

export const editVersionFoundationTestQuestionAnswerActionApi = (data) => {
  return async (dispatch) => {
    try {
      let formData = new FormData();
      let {programVersionInfo, questionId, answerId, description, image} = data
      formData.append('image', image);
      formData.append('answerId', answerId);
      formData.append('description', description);
      let result = await programService.editVersionFoundationTestQuestionAnswer(programVersionInfo, formData, questionId, answerId)
      if(result && result.data?.code > 0) {
        notifiFunction('success', result.data?.enMessage)
      } 
      if(result && result.data?.code < 0) {
        notifiFunction('error', result.data?.enMessage)
      } 
      dispatch({
        type: CLOSE_FORM_COURSE_DRAWER,
      }) 
      dispatch(getVersionFoundationTestQuestionActionApi(programVersionInfo,  1, 1000))
    } catch(err) {
      notifiFunction('error', 'Edit question failed!')
      console.log('err', err)
    }
  }
}

export const deleteVersionFoundationTestQuestionAnswerActionApi = (data) => {
  return async (dispatch) => {
    try {
      let {programVersionInfo, questionId, answerId} = data
      let result = await programService.deleteVersionFoundationTestQuestionAnswer(programVersionInfo, questionId, answerId)
      if(result && result.data) {
        dispatch({
          type: CLOSE_FORM_COURSE_DRAWER,
        })
      }
      notifiFunction('success', 'Delete course successfully!')
      dispatch(getVersionFoundationTestQuestionActionApi(programVersionInfo,  1, 1000))
    } catch(err) {
      notifiFunction('error', 'Delete course failed!')
      console.log('err', err);
    }
  }
}

export const getVersionFoundationTestResultActionApi = (programVersionInfo, page) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let result = await programService.getVersionFoundationTestResult(programVersionInfo, page)
      if (result && result.data) {
        dispatch({
          type: GET_VERSION_FOUNDATION_TEST_RESULT,
          payload: result.data
        })
      }
      dispatch({type: HIDE_LOADING})
    } catch(err) {
      dispatch({type: HIDE_LOADING})
      console.log('err', err);
    }
  }
}

export const getVersionFoundationTestResultAnswerActionApi = (programVersionInfo, questionNum) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let result = await programService.getVersionFoundationTestResultAnswer(programVersionInfo, questionNum)
      if (result && result.data) {
        dispatch({
          type: GET_VERSION_FOUNDATION_TEST_RESULT_ANSWER,
          payload: result.data
        })
      }
      dispatch({type: HIDE_LOADING})
    } catch(err) {
      dispatch({type: HIDE_LOADING})
      console.log('err', err);
    }
  }
}

export const postVersionFoundationTestResultActionApi = (data) => {
  return async (dispatch) => {
    try {
      let {programVersionInfo, selectedCellArray} = data
      let result = await programService.postVersionFoundationTestResult(programVersionInfo, selectedCellArray)
      if(result && result.data?.code > 0) {
        notifiFunction('success', result.data?.enMessage)
      } 
      if(result && result.data?.code < 0) {
        notifiFunction('error', result.data?.enMessage)
      }  
      dispatch(getVersionFoundationTestResultActionApi(programVersionInfo, 1))
    } catch(err) {
      notifiFunction('error', 'Post question failed!')
      console.log('err', err)
    }
  }
}

export const getVersionSurveyResultActionApi = (programVersionInfo, surveyName, surveyType, page) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let result = await programService.getVersionSurveyResult(programVersionInfo, surveyName, surveyType, page)
      if (result && result.data) {
        dispatch({
          type: GET_VERSION_SURVEY_RESULT,
          payload: result.data
        })
      }
      dispatch({type: HIDE_LOADING})
    } catch(err) {
      dispatch({type: HIDE_LOADING})
      console.log('err', err);
    }
  }
}

export const postVersionSurveyResultActionApi = (data) => {
  return async (dispatch) => {
    try {
      let {programVersionInfo, surveyName, surveyType, selectedCellArray} = data
      let result = await programService.postVersionSurveyResult(programVersionInfo, surveyName, surveyType, selectedCellArray)
      if(result && result.data?.code > 0) {
        notifiFunction('success', result.data?.enMessage)
      }
      if(result && result.data?.code < 0) {
        notifiFunction('error', result.data?.enMessage)
      }
      dispatch(getVersionSurveyResultActionApi(programVersionInfo, surveyName, surveyType, 1))
      dispatch(getVersionSurveyResultStatOptionsActionApi())
      dispatch(getVersionSurveyResultStatActionApi(programVersionInfo, surveyName, surveyType));
    } catch(err) {
      notifiFunction('error', 'Post question failed!')
      console.log('err', err)
    }
  }
}

export const deleteVersionSurveyResultActionApi = (data) => {
  return async (dispatch) => {
    try {
      let {programVersionInfo, surveyName, surveyType, selectedRow} = data
      let result = await programService.deleteVersionSurveyResult(programVersionInfo, surveyName, surveyType, selectedRow)
      if(result && result.data?.code > 0) {
        notifiFunction('success', result.data?.enMessage)
      } 
      if(result && result.data?.code < 0) {
        notifiFunction('error', result.data?.enMessage)
      }  
      dispatch(getVersionSurveyResultActionApi(programVersionInfo, surveyName, surveyType, 1))
      dispatch(getVersionSurveyResultStatOptionsActionApi())
    } catch(err) {
      notifiFunction('error', 'Post question failed!')
      console.log('err', err)
    }
  }
}

export const getVersionSurveyResultStatActionApi = (programVersionInfo, surveyName, surveyType) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let result = await programService.getVersionSurveyResultStat(programVersionInfo, surveyName, surveyType)
      if (result && result.data) {
        dispatch({
          type: GET_VERSION_SURVEY_RESULT_STAT,
          payload: result.data
        })
      }
      dispatch({type: HIDE_LOADING})
    } catch(err) {
      dispatch({type: HIDE_LOADING})
      console.log('err', err);
    }
  }
}

// goi lai getVersionSurveyResultStatActionApi = (programVersionInfo, surveyName, surveyType)
export const editVersionSurveyResultStatActionApi = (data) => {
  return async (dispatch) => {
    try {
      let {programVersionInfo, surveyName, surveyType, selectedRowStaticArray} = data
      let result = await programService.editVersionSurveyResultStat(programVersionInfo, surveyName, surveyType, selectedRowStaticArray)
      if(result && result.data?.code > 0) {
        notifiFunction('success', result.data?.enMessage)
      } 
      if(result && result.data?.code < 0) {
        notifiFunction('error', result.data?.enMessage)
      }  
      dispatch(getVersionSurveyResultStatActionApi(programVersionInfo, surveyName, surveyType))
    } catch(err) {
      notifiFunction('error', 'Post question failed!')
      console.log('err', err)
    }
  }
}

export const getVersionSurveyResultStatOptionsActionApi = () => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let result = await programService.getVersionSurveyResultStatOptions()
      if (result && result.data) {
        dispatch({
          type: GET_VERSION_SURVEY_RESULT_STAT_OPTIONS,
          payload: result.data
        })
      }
      dispatch({type: HIDE_LOADING})
    } catch(err) {
      dispatch({type: HIDE_LOADING})
      console.log('err', err);
    }
  }
}

export const getVersionSurveyResultAnswerOptionsActionApi = (programVersionInfo, surveyName, surveyIndicatorId) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let result = await programService.getVersionSurveyResultAnswerOptions(programVersionInfo, surveyName, surveyIndicatorId)
      if (result && result.data) {
        dispatch({
          type: GET_VERSION_SURVEY_RESULT_ANSWER_OPTIONS,
          payload: result.data
        })
      }
      dispatch({type: HIDE_LOADING})
    } catch(err) {
      dispatch({type: HIDE_LOADING})
      console.log('err', err);
    }
  }
}

export const postImportFileSupervisorResultActionApi = (data) => {
  return async (dispatch) => {
    try {      
    let formData = new FormData();
    let {programVersionInfo, surveyName, surveyType, fileInfo} = data
    let {sheet, file} = fileInfo
      formData.append('sheet', sheet);
      formData.append('file', file);
      let result = await programService.postImportFileSupervisorResult(programVersionInfo, surveyName, surveyType, formData)
      if(result && result.data?.code > 0) {
        notifiFunction('success', result.data?.enMessage)
      } 
      if(result && result.data?.code < 0) {
        notifiFunction('error', result.data?.enMessage)
      }  
      dispatch(getVersionSurveyResultActionApi(programVersionInfo, surveyName, surveyType, 1))
      dispatch(getVersionSurveyResultStatOptionsActionApi())
    } catch(err) {
      notifiFunction('error', 'Post question failed!')
      console.log('err', err)
    }
  }
}

export const getSubjectsSideBarActionApi = (page, searchObj = []) => {
  return async (dispatch) => {
    dispatch({type: DISPLAY_LOADING})
    try {
      let result = await programService.getSubjectsSideBar(page, searchObj)
      if (result && result.data) {
        dispatch({
          type: GET_ALL_SUBJECTS_SIDEBAR,
          payload: result.data
        })
      }
    } catch(err) {
      console.log('err', err);
    }
    dispatch({type: HIDE_LOADING})
  }
}

export const postSubjectsSideBarActionApi = (data) => {
  return async (dispatch) => {
    try {
      let result = await programService.postSubjectsSideBar(data)
      if(result && result.data?.code > 0) {
        notifiFunction('success', result.data?.enMessage)
      } 
      if(result && result.data?.code < 0) {
        notifiFunction('error', result.data?.enMessage)
      }  
      dispatch({
        type: CLOSE_FORM_COURSE_DRAWER,
      })
      dispatch({
        type: SET_IS_UPDATE_SUCCESS,
        payload: true
      }) 
      dispatch(getSubjectsSideBarActionApi(1))
    } catch(err) {
      console.log('err', err)
      dispatch({
        type: SET_IS_UPDATE_SUCCESS,
        payload: false
      }) 
    }
  }
}

export const editSubjectsSideBarActionApi = (data) => {
  return async (dispatch) => {
    try {
      let {id} = data
      let result = await programService.editSubjectsSideBar(id, data)
      if(result && result.data?.code > 0) {
        notifiFunction('success', result.data?.enMessage)
      } 
      if(result && result.data?.code < 0) {
        notifiFunction('error', result.data?.enMessage)
      } 
      dispatch({
        type: CLOSE_FORM_COURSE_DRAWER,
      }) 
      dispatch({
        type: SET_IS_UPDATE_SUCCESS,
        payload: true
      }) 
      dispatch(getSubjectsSideBarActionApi(1))
    } catch(err) {
      console.log('err', err)
      dispatch({
        type: SET_IS_UPDATE_SUCCESS,
        payload: false
      }) 
    }
  }
}

export const deleteSubjectsSideBarActionApi = (id) => {
  return async (dispatch) => {
    try {
      let result = await programService.deleteSubjectsSideBar(id)
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
      dispatch(getSubjectsSideBarActionApi(1))
    } catch(err) {
      notifiFunction('error', 'Delete course failed!')
      console.log('err', err);
      dispatch({
        type: SET_IS_UPDATE_SUCCESS,
        payload: false
      }) 
    }
  }
}