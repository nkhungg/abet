import { GET_COURSE_INSTANCE, GET_COUSE_OUTCOME_LIST, GET_CIR_COURSE_AUTOCOMPLETE, GET_CIR_GROUP_LIST, GET_CIR_SEMESTER_LIST, GET_COURSE_BY_CIR_LIST, GET_GENERAL_PROGRAM_LIST, GET_INDICATORS_LIST, GET_MATRIX_OUTCOME_COURSE, GET_MATRIX_PEO, GET_OUTCOMES_LIST, GET_PEOS_LIST, GET_PROGRAM_LIST, GET_SEMESTER_GROUP_AUTOCOMPLETE, SET_CUR_GROUP_ID, SET_CUR_SEMESTER_ID, SET_EDIT_CIR_COURSE, SET_EDIT_CIR_GROUP, SET_EDIT_CIR_SEMESTER, SET_EDIT_GENERAL_PROGRAM, SET_EDIT_INDICATOR, SET_EDIT_OUTCOME, SET_EDIT_PEOS, SET_EDIT_PROGRAM, SET_GEN_PROGRAM_INFO, SET_OUTCOME_NAME, SET_PROGRAM_ID, SET_CUR_COURSE_ID, SET_EDIT_COURSE_OUTCOME, GET_INDICATOR_NAME_AUTOCOMPLETE, GET_PARENT_ID_AUTOCOMPLETE, GET_COURSE_OUTLINE_INFO, GET_COURSE_ID_LIST_FROM_COURSE_OUTLINE, GET_LECTURERS_FROM_COURSE_OUTLINE, GET_OUTCOMES_FROM_COURSE_OUTLINE, GET_DETAILS_FROM_COURSE_OUTLINE, SET_DETAILS_IN_COURSE_OUTLINE, SET_OUTCOMES_IN_COURSE_OUTLINE, GET_PROGRAM_VERSION, SET_EDIT_PROGRAM_VERSION, SET_PROGRAM_VERSION_ID, SET_FLOW_PROGRAM_VERSION, SET_EDIT_COURSE_INSTANCE, SET_CUR_COURSE_ID_FROM_COURSE_INSTANCE, GET_PROGRAM_VERSION_IDS, GET_COURSE_INSTANCE_IDS, SET_PROGRAM_INSTANCE_ID, GET_COURSE_OUTCOMES_FROM_COURSE_INSTANCE, SET_EDIT_COURSE_OUTCOME_FROM_COURSE_INSTANCE, GET_PARENT_ID_AUTOCOMPLETE_COURSE_INSTANCE, GET_MATRIX_OUTCOME_INDICATOR, GET_COURSE_INSTANCE_OUTLINE, GET_COURSE_OUTCOMES_FROM_INSTANCE_OUTLINE, SET_EDIT_COURSE_OUTCOME_INSTANCE, GET_OUTLINE_DETAIL_FROM_COURSE_INSTANCE, SET_DETAILS_IN_COURSE_OUTLINE_INSTANCE, SET_EDIT_COURSE_ACCESSMENT, SET_EDIT_CLASS_FROM_COURSE_INSTANCE, GET_CLASSES_FROM_COURSE_INSTANCE, SET_EDIT_VERSION_CLASS_ASSESSMENT, GET_VERSION_CLASS_ASSESSMENT, SET_VERSION_CLASS_ID, GET_VERSION_CLASS_STUDENT, GET_ALL_STUDENTS, GET_STUDENTS, SET_EDIT_STUDENT, SET_EDIT_LECTURER, GET_LECTURERS, GET_SEARCH_STUDENTS, GET_DIRECT_COURSE_INSTANCE, SET_FLOW_GENERAL_PROGRAM, SET_EDIT_DIRECT_COURSE_INSTANCE, GET_PROGRAM_INFO, SET_COURSE_INSTANCE_OUTSIDE, GET_VERSION_COURSE_INSTANCE_TEST, SET_EDIT_VERSION_COURSE_INSTANCE_TEST, SET_VERSION_COURSE_INSTANCE_TEST_ID, GET_VERSION_COURSE_INSTANCE_TEST_COURSE_OUTCOME, SET_EDIT_VERSION_COURSE_INSTANCE_TEST_COURSE_OUTCOME, GET_VERSION_COURSE_INSTANCE_TEST_QUESTION, SET_EDIT_VERSION_COURSE_INSTANCE_TEST_QUESTION, SET_EDIT_VERSION_COURSE_INSTANCE_TEST_QUESTION_OUTCOME, GET_VERSION_COURSE_INSTANCE_CALSS_TEST_QUESTION, SET_EDIT_VERSION_THESIS, SET_EDIT_VERSION_THESIS_LECTURER, GET_VERSION_THESIS, GET_VERSION_SURVEY, SET_EDIT_VERSION_SURVEY, GET_SURVEYS, SET_EDIT_SURVEY, SET_PROGRAM_VERSION_INFO_FROM_SURVEY_OUTSIDE, GET_VERSION_SURVEY_QUESTION, SET_EDIT_VERSION_SURVEY_QUESTION, SET_EDIT_VERSION_SURVEY_QUESTION_ANSWER, GET_ALL_OUTCOME_LIST, GET_ALL_SUBJECTS, GET_VERSION_FOUNDATION_TEST_SUBJECTS, SET_EDIT_VERSION_FOUNDATION_TEST_QUESTIONS, GET_VERSION_FOUNDATION_TEST_QUESTIONS, SET_EDIT_VERSION_FOUNDATION_TEST_QUESTIONS_ANSWER, GET_ALL_INDICATOR_BY_OUTCOME_NAME, GET_VERSION_FOUNDATION_TEST_RESULT, GET_VERSION_FOUNDATION_TEST_RESULT_ANSWER, GET_VERSION_SURVEY_RESULT, GET_VERSION_SURVEY_RESULT_STAT, GET_VERSION_SURVEY_RESULT_STAT_OPTIONS, GET_VERSION_SURVEY_RESULT_ANSWER_OPTIONS, GET_ALL_SUBJECTS_SIDEBAR, SET_EDIT_ALL_SUBJECT_SIDEBAR, SET_TYPE_CHART, SET_IS_UPDATE_SUCCESS, GET_USERS, SET_EDIT_USER } from '../../types/index';

const stateDefault = {
    generalProgram: {},
    program: {},
    peos: {},
    outcomes: {},
    indicators: {},
    cirSemester: {},
    cirGroup: {},
    courseByCirr: {},
    courseOutcome: {},
    maxtrixPeo: {},
    matrixOutcomeCourse: {},
    courseOutlineInfo: {},
    courseIdListFromCourseOutline: {},
    lecturersFromCourseOutline: {},
    outcomesFromCourseOutline: {},
    detailsFromCourseOutline: {},
    selectedFolw: {
        generalProgramId: null,
        generalProgramMajor: null,
        generalProgramDesc: null,
        programId: null,
        outcomeName: null,
        cirSemesterId: null,
        cirGroupId: null,
        type: null,
        cirCourseId: null,
    },
    editGeneralProgram: {},
    editProgram: {},
    editPeos: {},
    editOutcome: {},
    editCirSemester: {},
    editCirGroup: {},
    editIndicator: {},
    editCirCourse: {},
    editCourseOutcome: {},
    editOutcomesInCourseOutline: {},
    editDetailsInCourseOutline: {},
    isSemester: null,
    courseAutocomplete: [],
    semesterGroupAutocomplete: [],
    indicatorNameAutocomplete: [],
    parentIdAutocomplete: [],

    // program version
    programVersion: {},
    editProgramVersion: {},
    programVersionIds: [],

    selectedFlowProgramVersion: {
        programVersionInfo: null,
        programVersionId: null, 
        courseId: null,
        classId: null,
        testId: null,
        programInstanceId: null,
        thesisVSId: null,
        courseVSId: null,
        surveyName: null,
        surveyType: null,
        surveyLock: null,
    },
    parentIdAutocompleteCourseInstance: {},
    courseInstance: {},
    editCourseInstance: {},
    courseInstanceIds: [],

    courseOutcomesFromCourseInstance: {},
    editCourseOutcomesFromCourseInstance: {},

    matrixCourseOutcomesIndicator: {},

    courseInstanceOutline: {},
    outcomesFromCourseOutlineInstance: {},
    editCourseOutlineOutcomesFromCourseInstance: {},

    outlineDetailFromCourseInstance: {},
    editOutlineDetailFromCourseInstance: {},
    editCourseAccessment: {},
    editClassFromCourseInstance: {},
    classesFromCourseInstance: {},
    versionClassAssessment: {},
    editVersionClassAssessment: {},

    versionClassStudent: {},

    allStudent: {},
    searchStudents: {},
    students: {},
    editStudent: {},
    lecturers: {},
    editLecturer: {},
    users: {},
    editUser: {},

    directCourseInstance: {},
    editDirectCourseInstance: {},
    programInfo: [],

    versionCourseIntanceTest: {},
    editVersionCourseInstanceTest: {},

    versionCourseIntanceTestCourseOutcome: {},
    editVersionCourseInstanceTestCourseOutcome: {},

    versionCourseIntanceTestQuestion: {},
    editVersionCourseInstanceTestQuestion: {},
    editVersionCourseInstanceTestQuestionOutcome: {},

    versionCourseIntanceClassTestQuestion: {},

    versionThesis: {},
    editVersionThesis: {},
    editVersionThesisLecturer: {},

    versionSurvey: {},
    editVersionSurvey: {},
    surveys: {},
    editSurvey: {},

    versionSurveyQuestion: {},
    editVersionSurveyQuestion: {},
    editVersionSurveyQuestionAnswer: {},
    allOutcomeList: {},

    versionSurveyResult: {},
    versionSurveyResultStat: {},
    versionSurveyResultStatOptions: {},
    versionSurveyResultAnswerOptions: {},

    versionFoundationTestSubjects: {},
    allSubjects: {},

    versionFoundationTestQuestions: {},
    editVersionFoundationTestQuestion: {},
    editVersionFoundationTestQuestionAnswer: {},

    versionFoundationTestResult: {},
    versionFoundationTestResultAnswer: {},

    allSubjectsSidebar: {},
    editSubjectSidebar: {},

    typeChart: 'verticle-bar', // horizontal-bar, pie, stacked-bar

    // after update table (post, put, delete) success, update sortObjet and page = 1;
    isUpdateSuccess: false,
};

export const GeneralProgramReducer = (state = stateDefault, action) => {
    switch (action.type) {
        case SET_TYPE_CHART: 
            state.typeChart = action.payload;
            return {...state};

        case GET_GENERAL_PROGRAM_LIST:
            state.generalProgram = action.payload;
            return { ...state };

        case GET_PROGRAM_LIST:
            state.program = action.payload;
            return { ...state };

        case GET_PEOS_LIST:
            state.peos = action.payload;
            return { ...state };
        
        case GET_OUTCOMES_LIST:
            state.outcomes = action.payload;
            return { ...state };

        case GET_INDICATORS_LIST: 
            state.indicators = action.payload;
            return { ...state };
    
        case GET_CIR_SEMESTER_LIST: 
            state.cirSemester = action.payload;
            return { ...state };
        
        case GET_CIR_GROUP_LIST: 
            state.cirGroup = action.payload;
            return { ...state };

        case GET_COURSE_BY_CIR_LIST: 
            state.courseByCirr = action.payload;
            return { ...state };

        case GET_COUSE_OUTCOME_LIST:
            state.courseOutcome = action.payload;
            return { ...state };
        
        case GET_COURSE_OUTLINE_INFO:
            state.courseOutlineInfo = action.payload
            return { ...state };
            
        case GET_MATRIX_PEO: 
            state.maxtrixPeo = action.payload
            return { ...state };

        case GET_MATRIX_OUTCOME_COURSE: 
            state.matrixOutcomeCourse = action.payload
            return { ...state };

        case SET_GEN_PROGRAM_INFO: {
            state.selectedFolw.generalProgramId = action.payload.id
            state.selectedFolw.generalProgramMajor = action.payload.major
            state.selectedFolw.generalProgramDesc = action.payload.description
            return { ...state};
        }

        case SET_PROGRAM_ID: {
            state.selectedFolw.programId = action.payload
            return { ...state};
        }

        case SET_OUTCOME_NAME: {
            state.selectedFolw.outcomeName = action.payload
            return { ...state};
        }

        case SET_CUR_SEMESTER_ID: {
            state.selectedFolw.cirSemesterId = action.payload.id
            state.selectedFolw.type = action.payload.type
            return { ...state};
        }

        case SET_CUR_GROUP_ID: {
            state.selectedFolw.cirGroupId = action.payload.id
            state.selectedFolw.type = action.payload.type
            return { ...state};
        }

        case SET_CUR_COURSE_ID: {
            state.selectedFolw.cirCourseId = action.payload
            return { ...state};
        }

        case SET_CUR_COURSE_ID_FROM_COURSE_INSTANCE: {
            state.selectedFolw.cirCourseId = action.payload.courseId
            state.selectedFolw.programId = action.payload.programId
            
            return { ...state};
        }

        case SET_PROGRAM_INSTANCE_ID: {
            state.selectedFlowProgramVersion.programInstanceId = action.payload.programInstanceId
            state.selectedFlowProgramVersion.courseId = action.payload.courseId
            state.selectedFlowProgramVersion.programVersionId = action.payload.programId
            return { ...state};
        }

        case SET_COURSE_INSTANCE_OUTSIDE: {
            state.selectedFlowProgramVersion.courseId = action.payload.courseId
            state.selectedFlowProgramVersion.programVersionInfo = action.payload.programVersionInfo
            return { ...state};
        }

        case SET_PROGRAM_VERSION_INFO_FROM_SURVEY_OUTSIDE: {
            let arrayInfo = action.payload.programVersionInfo.split('-')
            state.selectedFlowProgramVersion.programVersionInfo = action.payload.programVersionInfo
            state.selectedFlowProgramVersion.programVersionId = arrayInfo[0]
            state.selectedFlowProgramVersion.surveyName = action.payload.name
            state.selectedFlowProgramVersion.surveyType = action.payload.type
            state.selectedFlowProgramVersion.surveyLock = action.payload.lock
            return {...state}
        }

        // FORM PROGRAM SYSTEM
        case SET_EDIT_GENERAL_PROGRAM: {
            state.editGeneralProgram = action.payload
            return {...state}
        }

        case SET_EDIT_PROGRAM: {
            state.editProgram = action.payload
            return {...state}
        }

        case SET_EDIT_PEOS: {
            state.editPeos = action.payload
            return {...state,...state.editPeos, programId: state.selectedFolw.programId}
        }

        case SET_EDIT_OUTCOME: {
            state.editOutcome = action.payload
            return {...state,...state.editOutcome, programId: state.selectedFolw.programId}
        }

        case SET_EDIT_CIR_SEMESTER: {
            state.editCirSemester = {...action.payload, programId: state.selectedFolw.programId, semesterName: action.payload.name}
            state.isSemester = true
            return {...state,...state.editCirSemester,programId: state.selectedFolw.programId}
        }

        case SET_EDIT_CIR_GROUP: {
            state.isSemester = false
            state.editCirGroup = {...action.payload, programId: state.selectedFolw.programId, groupName: action.payload.name}
            return {...state}
        }

        case SET_EDIT_INDICATOR: {
            state.editIndicator = {...action.payload, programId: state.selectedFolw.programId, outcomeName: state.selectedFolw.outcomeName}
            return {...state}
        }

        case SET_EDIT_CIR_COURSE: {
            state.editCirCourse = {...action.payload, type: action.payload.type}
            return {...state}
        }

        case SET_EDIT_COURSE_OUTCOME: {
            state.editCourseOutcome = action.payload
            return {...state}
        }

        case GET_CIR_COURSE_AUTOCOMPLETE: {
            state.courseAutocomplete = action.payload
            return {...state}
        }

        case GET_SEMESTER_GROUP_AUTOCOMPLETE: {
            state.semesterGroupAutocomplete = action.payload
            return {...state}
        }

        case GET_INDICATOR_NAME_AUTOCOMPLETE: {
            state.indicatorNameAutocomplete = action.payload
            return {...state}
        }

        case GET_PARENT_ID_AUTOCOMPLETE: {
            state.parentIdAutocomplete = action.payload
            return {...state}
        }

        case GET_COURSE_ID_LIST_FROM_COURSE_OUTLINE: {
            state.courseIdListFromCourseOutline = action.payload
            return {...state}
        }

        case GET_LECTURERS_FROM_COURSE_OUTLINE: {
            state.lecturersFromCourseOutline = action.payload
            return {...state}
        }

        case GET_OUTCOMES_FROM_COURSE_OUTLINE: {
            state.outcomesFromCourseOutline = action.payload
            return {...state}
        }
        
        case GET_DETAILS_FROM_COURSE_OUTLINE: {
            state.detailsFromCourseOutline = action.payload
            return {...state}
        }
        
        case SET_DETAILS_IN_COURSE_OUTLINE: {
            if(action.payload.isEdit) {
                state.editDetailsInCourseOutline = action.payload
            } else {
                state.editDetailsInCourseOutline = {...action.payload, programId: state.selectedFolw.programId, courseId: state.selectedFolw.cirCourseId}
            }
            return {...state}
        }
        
        case SET_OUTCOMES_IN_COURSE_OUTLINE: {
            state.editOutcomesInCourseOutline = action.payload
            return {...state}
        }

        // PROGRAM VERSION

        case GET_PROGRAM_VERSION: {
            state.programVersion = action.payload
            return {...state}
        }

        case SET_EDIT_PROGRAM_VERSION: {
            state.editProgramVersion = action.payload
            return {...state}
        }

        case GET_PROGRAM_VERSION_IDS: {
            state.programVersionIds = action.payload
            return {...state}
        }

        case SET_PROGRAM_VERSION_ID: {
            let arrayInfo = action.payload.split('-')
            state.selectedFlowProgramVersion.programVersionInfo = action.payload
            state.selectedFlowProgramVersion.programVersionId = arrayInfo[0]
            return {...state}
        }

        
        case SET_EDIT_COURSE_INSTANCE: {
            state.editCourseInstance = action.payload
            return {...state}
        }
        
        case GET_COURSE_INSTANCE: {
            state.courseInstance = action.payload
            return {...state}
        }

        case GET_COURSE_INSTANCE_IDS: {
            state.courseInstanceIds = action.payload
            return {...state}
        }

        case GET_COURSE_OUTCOMES_FROM_COURSE_INSTANCE: {
            state.courseOutcomesFromCourseInstance = action.payload
            return {...state}
        }

        case SET_EDIT_COURSE_OUTCOME_FROM_COURSE_INSTANCE: {
            state.editCourseOutcomesFromCourseInstance = action.payload
            return {...state}
        }

        case GET_PARENT_ID_AUTOCOMPLETE_COURSE_INSTANCE: {
            state.parentIdAutocompleteCourseInstance = action.payload
            return {...state}
        }

        case GET_MATRIX_OUTCOME_INDICATOR: {
            state.matrixCourseOutcomesIndicator = action.payload
            return {...state}
        }

        case GET_COURSE_INSTANCE_OUTLINE: {
            state.courseInstanceOutline = action.payload
            return {...state}
        }

        case GET_COURSE_OUTCOMES_FROM_INSTANCE_OUTLINE: {
            state.outcomesFromCourseOutlineInstance = action.payload
            return {...state}
        }

        case SET_EDIT_COURSE_OUTCOME_INSTANCE: {
            state.editCourseOutlineOutcomesFromCourseInstance = action.payload
            return {...state}
        }

        case GET_OUTLINE_DETAIL_FROM_COURSE_INSTANCE: {
            state.outlineDetailFromCourseInstance = action.payload
            return {...state}
        }

        case SET_DETAILS_IN_COURSE_OUTLINE_INSTANCE: {
            state.editOutlineDetailFromCourseInstance = action.payload
            return {...state}
        }

        case SET_EDIT_COURSE_ACCESSMENT: {
            state.editCourseAccessment = action.payload
            return {...state}
        }

        case SET_EDIT_CLASS_FROM_COURSE_INSTANCE: {
            state.editClassFromCourseInstance = action.payload
            return {...state}
        }

        case GET_CLASSES_FROM_COURSE_INSTANCE: {
            state.classesFromCourseInstance = action.payload
            return {...state}
        }

        case SET_VERSION_CLASS_ID: {
            state.selectedFlowProgramVersion.classId = action.payload.id
            return {...state}
        }

        case GET_VERSION_CLASS_ASSESSMENT: {
            state.versionClassAssessment = action.payload
            return {...state}
        }

        case SET_EDIT_VERSION_CLASS_ASSESSMENT: {
            state.editVersionClassAssessment = action.payload
            return {...state}
        }

        case GET_VERSION_CLASS_STUDENT: {
            state.versionClassStudent = action.payload
            return {...state}
        }

        case GET_USERS: {
            state.users = action.payload
            return {...state}
        }

        case SET_EDIT_USER: {
            state.editUser = action.payload
            return {...state}
        }

        case GET_ALL_STUDENTS: {
            state.allStudent = action.payload
            return {...state}
        }

        case GET_SEARCH_STUDENTS: {
            state.searchStudents = action.payload
            return {...state}
        }

        case GET_STUDENTS: {
            state.students = action.payload
            return {...state}
        }
        
        case SET_EDIT_STUDENT: {
            state.editStudent = action.payload
            return {...state}
        }

        case GET_LECTURERS: {
            state.lecturers = action.payload
            return {...state}
        }

        case SET_EDIT_LECTURER: {
            state.editLecturer = action.payload
            return {...state}
        }

        case GET_DIRECT_COURSE_INSTANCE: {
            state.directCourseInstance = action.payload
            return {...state}
        }

        case SET_EDIT_DIRECT_COURSE_INSTANCE: {
            state.editDirectCourseInstance = action.payload
            return {...state}
        }

        case GET_PROGRAM_INFO: {
            state.programInfo = action.payload
            return {...state}
        }

        case GET_VERSION_COURSE_INSTANCE_TEST: {
            state.versionCourseIntanceTest = action.payload
            return {...state}
        }

        case SET_EDIT_VERSION_COURSE_INSTANCE_TEST: {
            state.editVersionCourseInstanceTest = action.payload
            return {...state}
        }

        case SET_VERSION_COURSE_INSTANCE_TEST_ID: {
            state.selectedFlowProgramVersion.testId = action.payload.id
            return {...state}
        }

        case GET_VERSION_COURSE_INSTANCE_TEST_COURSE_OUTCOME: {
            state.versionCourseIntanceTestCourseOutcome = action.payload
            return {...state}
        }

        case SET_EDIT_VERSION_COURSE_INSTANCE_TEST_COURSE_OUTCOME: {
            state.editVersionCourseInstanceTestCourseOutcome = action.payload
            return {...state}
        }

        case GET_VERSION_COURSE_INSTANCE_TEST_QUESTION: {
            state.versionCourseIntanceTestQuestion = action.payload
            return {...state}
        }

        case GET_VERSION_COURSE_INSTANCE_CALSS_TEST_QUESTION: {
            state.versionCourseIntanceClassTestQuestion = action.payload
            return {...state}
        }

        case SET_EDIT_VERSION_COURSE_INSTANCE_TEST_QUESTION: {
            state.editVersionCourseInstanceTestQuestion = action.payload
            return {...state}
        }

        case SET_EDIT_VERSION_COURSE_INSTANCE_TEST_QUESTION_OUTCOME: {
            state.editVersionCourseInstanceTestQuestionOutcome = action.payload
            return {...state}
        }

        case GET_VERSION_THESIS: {
            state.versionThesis = action.payload
            return {...state}
        }

        case SET_EDIT_VERSION_THESIS: {
            state.editVersionThesis = action.payload
            return {...state}
        }

        case SET_EDIT_VERSION_THESIS_LECTURER: {
            state.editVersionThesisLecturer = action.payload
            return {...state}
        }

        case GET_VERSION_SURVEY: {
            state.versionSurvey = action.payload
            return {...state}
        }

        case SET_EDIT_VERSION_SURVEY: {
            state.editVersionSurvey = action.payload
            return {...state}
        }

        case GET_SURVEYS: {
            state.surveys = action.payload
            return {...state}
        }

        case SET_EDIT_SURVEY: {
            state.editSurvey = action.payload
            return {...state}
        }

        case GET_VERSION_SURVEY_QUESTION: {
            state.versionSurveyQuestion = action.payload
            return {...state}
        }

        case SET_EDIT_VERSION_SURVEY_QUESTION: {
            state.editVersionSurveyQuestion = action.payload
            return {...state}
        }

        case SET_EDIT_VERSION_SURVEY_QUESTION_ANSWER: {
            state.editVersionSurveyQuestionAnswer = action.payload
            return {...state}
        }

        case GET_ALL_OUTCOME_LIST: {
            state.allOutcomeList = action.payload
            return {...state}
        }

        case GET_VERSION_FOUNDATION_TEST_SUBJECTS: {
            state.versionFoundationTestSubjects = action.payload
            return {...state}
        }

        case GET_ALL_SUBJECTS: {
            state.allSubjects = action.payload
            return {...state}
        }

        case GET_VERSION_FOUNDATION_TEST_QUESTIONS: {
            state.versionFoundationTestQuestions = action.payload
            return {...state}
        }

        case SET_EDIT_VERSION_FOUNDATION_TEST_QUESTIONS: {
            state.editVersionFoundationTestQuestion = action.payload
            return {...state}
        }

        case SET_EDIT_VERSION_FOUNDATION_TEST_QUESTIONS_ANSWER: {
            state.editVersionFoundationTestQuestionAnswer = action.payload
            return {...state}
        }

        case GET_ALL_INDICATOR_BY_OUTCOME_NAME: {
            state.allIndicatorByOutcomeName = action.payload
            return {...state}
        }

        case GET_VERSION_FOUNDATION_TEST_RESULT: {
            state.versionFoundationTestResult = action.payload
            return {...state}
        }

        case GET_VERSION_FOUNDATION_TEST_RESULT_ANSWER: {
            state.versionFoundationTestResultAnswer = action.payload
            return {...state}
        }

        case GET_VERSION_SURVEY_RESULT: {
            state.versionSurveyResult = action.payload
            return {...state}
        }

        case GET_VERSION_SURVEY_RESULT_STAT: {
            state.versionSurveyResultStat = action.payload
            return {...state}
        }

        case GET_VERSION_SURVEY_RESULT_STAT_OPTIONS: {
            state.versionSurveyResultStatOptions = action.payload
            return {...state}
        }

        case GET_VERSION_SURVEY_RESULT_ANSWER_OPTIONS: {
            state.versionSurveyResultAnswerOptions = action.payload
            return {...state}
        }

        case GET_ALL_SUBJECTS_SIDEBAR: {
            state.allSubjectsSidebar = action.payload
            return {...state}
        }

        case SET_EDIT_ALL_SUBJECT_SIDEBAR: {
            state.editSubjectSidebar = action.payload
            return {...state}
        }

        case SET_FLOW_GENERAL_PROGRAM: {
            let pathName = action.payload
            switch (pathName[0]) {
                case 'general-program':
                    if (pathName[1]) {
                        state.selectedFolw.generalProgramId = pathName[1]
                        switch (pathName[2]) {
                            case 'program':
                                if (pathName[3]) {
                                    state.selectedFolw.programId = pathName[3]
                                    switch (pathName[4]) {
                                        case 'program-outcome':
                                            if (pathName[5]) {
                                                state.selectedFolw.outcomeName = pathName[5]
                                            }
                                            break;
                                        case 'curriculum':
                                            if (pathName[5]) {
                                                let arrayInfo = pathName[5].split(
                                                    '-')
                                                if (pathName[5].toLowerCase().startsWith(
                                                    "semester")) {
                                                    state.selectedFolw.cirSemesterId = arrayInfo[1]
                                                    state.selectedFolw.type = true
                                                } else {
                                                    state.selectedFolw.cirGroupId = arrayInfo[1]
                                                    state.selectedFolw.type = false
                                                }
                                            }
                                            switch (pathName[6]) {
                                                case 'course':
                                                    if (pathName[7]) {
                                                        state.selectedFolw.cirCourseId = pathName[7]
                                                    }
                                                    break;
                                                default:
                                                    break;
                                            }
                                            break;
                                        default:
                                            break;
                                    }
                                }
                                break;
                            default:
                                break;
                        }
                    }
                    break

                default:
                    break;
            }
            return {...state}
        }

        case SET_FLOW_PROGRAM_VERSION: {
            let pathName = action.payload
            switch (pathName[0]) {
                case 'program-version':
                    if(pathName[1]) {
                        state.selectedFlowProgramVersion.programVersionInfo = pathName[1]
                        
                        let arrayInfo = pathName[1].split('-')
                        state.selectedFlowProgramVersion.programVersionId = arrayInfo[0]
                        switch (pathName[2]) {
                            case 'course-instances':
                                if(pathName[3]) {
                                    state.selectedFlowProgramVersion.courseId = pathName[3]

                                    switch (pathName[4]) {
                                        case 'classes': // course-outcome, question, result
                                            if(pathName[5]) {
                                                state.selectedFlowProgramVersion.classId = pathName[5]

                                                switch (pathName[6]) {
                                                    case 'test':
                                                        if(pathName[7]) {
                                                            state.selectedFlowProgramVersion.testId = pathName[7]
                                                        }
                                                        break;
                                                
                                                    default:
                                                        break;
                                                }
                                            }  

                                            break;
                                        
                                        case 'test':
                                            if(pathName[5]) {
                                                state.selectedFlowProgramVersion.testId = pathName[5]
                                            }  

                                            break;
                                    
                                        default:
                                            break;
                                    }
                                }
                                break;

                            case 'survey': {
                                if(pathName[3]) {
                                    let infoSurvey = pathName[3].split('-')
                                    state.selectedFlowProgramVersion.surveyName = infoSurvey[0]
                                    state.selectedFlowProgramVersion.surveyType = infoSurvey[1]
                                }
                                break
                            }
                        
                            default:
                                break;
                        }
                    }
                    break

                default:
                    break;
            }
            return {...state}
        }

        case SET_IS_UPDATE_SUCCESS: {
            state.isUpdateSuccess = action.payload;
            return {...state};
        }

        default:
            return state;
    }
};