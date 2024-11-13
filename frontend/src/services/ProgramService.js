import { baseService } from './BaseService'
export class ProgramService extends baseService {

    // A.GET LIST TABLE PROGRAM SYSTEM

    // 1. General program
    getGeneralProgramList = (page, searchObj = []) => {
        let searchContent = ''
        searchObj.forEach(element => {
            searchContent += `&${element.key}=${element.val}`
        });
        return this.get(`/general-programs?currentPage=${page}${searchContent}`)
    }

    //  2. Program by General program
    getProgramByGenProgramList = (page, id, searchObj = []) => {
        let searchContent = ''
        searchObj.forEach(element => {
            searchContent += `&${element.key}=${element.val}`
        });
        return this.get(`/programs?idGeneralProgram=${id}&currentPage=${page}${searchContent}`)
    }

    // 3. PEOs by program
    getPEOsByProgramList = (page, id, searchObj = []) => {
        let searchContent = ''
        searchObj.forEach(element => {
            searchContent += `&${element.key}=${element.val}`
        })
        return this.get(`/programs/${id}/peos?currentPage=${page}${searchContent}`)
    }

    // 4. PG Outcomes by prpgram
    getOutcomesByProgramList = (page, id, searchObj = []) => {
        let searchContent = ''
        searchObj.forEach(element => {
            searchContent += `&${element.key}=${element.val}`
        })
        return this.get(`/programs/${id}/outcomes?currentPage=${page}${searchContent}`)
    }

    // 4.1 Indicators from outcomes
    getIndicatorsByOutcomeList = (page, programId, outcomeName, searchObj = []) => {
        let searchContent = ''
        searchObj.forEach(element => {
            searchContent += `&${element.key}=${element.val}`
        })
        return this.get(`/programs/${programId}/outcomes/${outcomeName}/indicators?currentPage=${page}${searchContent}`)
    }
    
    // 5.1 Currilculum semester
    getCirrSemesterList = (programId) => {
        return this.get(`/programs/${programId}/semesters?`)
    }

    // 5.2 Currilculum groups
    getCirrGroupsList = (programId) => {
        return this.get(`/programs/${programId}/groups?`)
    }

    // 5.3 Course from curriculum
    getCourseByCirrList = (page, programId, id, type, searchObj = []) => {
        let searchContent = ''
        searchObj.forEach(element => {
            searchContent += `&${element.key}=${element.val}`
        })
        return this.get(`/programs/${programId}/${type ? 'semesters' : 'groups'}/${id}/courses?currentPage=${page}${searchContent}`)
    }

    //  6. Matrix PEO 
    getMatrixPeo = (programId, page) => {
        return this.get(`/programs/${programId}/peo-outcome?currentPage=${page}`)
    }

    // 6.1. Post Matrix PEO
    postMatrixPeo = (programId, peoOutcome) => {
        return this.post(`/programs/${programId}/peo-outcome`, 2, peoOutcome)
    }

    // 7. Matrix Outcome Course
    getMatrixOutcomeCourse = (programId, page) => {
        return this.get(`/programs/${programId}/outcome-course?currentPage=${page}`)
    }

    // 7.1. Post Matrix Outcome Course
    postMatrixOutcomeCourse = (programId, OutcomeCourse) => {
        return this.post(`/programs/${programId}/outcome-course`, 2, OutcomeCourse)
    }

    // 8. Get general-course-id List
    getCourseAutocomplete = () => {
        return this.get(`/general-courses/ids`)
    }

    // 9. Get Course Outcome 
    getCourseOutcome = (programId, courseId, page, searchObj = []) => {
        let searchContent = ''
        searchObj.forEach(element => {
            searchContent += `&${element.key}=${element.val}`
        })
        return this.get(`/programs/${programId}/courses/${courseId}/outcomes?currentPage=${page}${searchContent}`)
    }

    // 10. Get Indicator Name autocomplete
    getIndicatorAutocomplete = (programId) => {
        return this.get(`/indicators/names?programId=${programId}`)
    }

    // 11. Get Parent Outcome autocomplete
    getParentOutcomeAutocomplete = (programId, courseId) => {
        return this.get(`/course-outcomes/names?programId=${programId}&courseId=${courseId}`)
    }

    // B.FORM PROGRAM SYSTEM

    // 0. Form General Program

    // 0.1 Post new general program
    postNewGeneralProgram = (formData) => {
        return this.post('/general-programs' , 3, formData)
    }

    // 0.2 Edit general program
    editGeneralProgram = (formData, id) => {
        return this.put(`/general-programs/${id}`, 3, formData)
    }

    // 0.3 Delete general program
    deleteGeneralProgram = (idProgram) => {
        return this.delete(`/general-programs/${idProgram}`)
    }

    // 1. Form Program

    // 1.1 Post new program
    postNewProgram = (formData) => {
        return this.post('/programs' , 3, formData)
    }

    // 1.2 Put program
    editProgram = (formData, id) => {
        return this.put(`/programs/${id}`, 3, formData)
    }

    // 1.3 Delete program
    deleteProgram = (idProgram) => {
        return this.delete(`/programs/${idProgram}`)
    }

    // 2. Form Peos by program

    // 2.1 Post new peos
    postNewPeos = (formData, programId) => {
        return this.post(`/programs/${programId}/peos` , 3, formData)
    }

    // 2.2 Edit peos
    editPeos = (formData, programId, peoName) => {
        return this.put(`/programs/${programId}/peos/${peoName}`, 3, formData)
    }

    // 2.3 Delete peos
    deletePeos = (programId, peosId) => {
        return this.delete(`/programs/${programId}/peos/${peosId}`)
    }

    // 3. ProgramOutcomes by program

    // 3.1 Post new outcomes
    postNewOutcomes = (formData, programId) => {
        return this.post(`/programs/${programId}/outcomes` , 3, formData)
    }

    // 3.2 Edit outcomes
    editOutcome = (formData, programId, outcomeName) => {
        return this.put(`/programs/${programId}/outcomes/${outcomeName}`, 3, formData)
    }

    // 3.3 Delete outcome
    deleteOutcomes = (programId, outcomeName) => {
        return this.delete(`/programs/${programId}/outcomes/${outcomeName}`)
    }

    // 4. Curriculum form

    // 4.1 Post new semester or group by crriculum
    postNewSemesterGroup = (data, programId, type) => {
        return this.post(`/programs/${programId}/${type ? 'semesters' : 'groups'}`, 2, data)
    }
    // 4.2 Edit semester or group by crriculum
    editSemesterGroup = (data, programId, id, type) => {
        return this.put(`/programs/${programId}/${type ? 'semesters' : 'groups'}/${id}`, 2, data)
    }
    // 4.3 Delete semester or group by crriculum
    
    deleteSemesterGroup = (programId, id, type) => {
        return this.delete(`/programs/${programId}/${type ? 'semesters' : 'groups'}/${id}`)
    }

    // 5. Form Indicators

    // 5.1 Post new indicators
    postNewIndicators = (formData, programId,  outcomeName) => {
        return this.post(`/programs/${programId}/outcomes/${outcomeName}/indicators` , 3, formData)
    }
    // 5.2 EDit indicators
    editIndicators = (formData, programId, outcomeName, indicatorName) => {
        return this.put(`/programs/${programId}/outcomes/${outcomeName}/indicators/${indicatorName}`, 3, formData)
    }
    // 5.3 Delete indicators
    deleteIndicator = (programId, outcomeName, indicatorName) => {
        return this.delete(`/programs/${programId}/outcomes/${outcomeName}/indicators/${indicatorName}`)
    }

    // 6 Form irriculum course 

    // 6.1 Post new curriculum course
    postNewCirrCourse = (programId, formData, semestergroupId, type) => {
        return this.post(`/programs/${programId}/${type ? 'semesters' : 'groups'}/${semestergroupId}/courses`, 3, formData)
    }
    // 6.2 Edit curriculum course
    editCirrCourse = (programId, formData, semestergroupId, courseId, type) => {
        return this.put(`/programs/${programId}/${type ? 'semesters' : 'groups'}/${semestergroupId}/courses/${courseId}`, 3, formData)
    }
    // 6.3 Delete curriculum course
    deleteCirrCourse = (programId, semestergroupId, courseId, type) => {
        return this.delete(`/programs/${programId}/${type ? 'semesters' : 'groups'}/${semestergroupId}/courses/${courseId}`)
    }

    // 7. Form course-outcome

    // 7.1 Add new course-outcome
    postNewCourseOutcome = (programId, courseId, formData) => {
        return this.post(`/programs/${programId}/courses/${courseId}/outcomes`, 3, formData)
    }
    // 7.2 Edit course-outcome
    editCourseOutcome = (programId, courseId, outcomeId, data) => {
        return this.put(`/programs/${programId}/courses/${courseId}/outcomes/${outcomeId}`, 2, data)
    }
    // 7.3 Delete course-outcom
    deleteCourseOutcome = (programId, courseId, outcomeId) => {
        return this.delete(`/programs/${programId}/courses/${courseId}/outcomes/${outcomeId}`)
    }

    // 8.  COURSE OUTLINE
    // 8.1 Course outline p1 p2 p3 p5 p6
    getCourseOutline = (programId, courseId) => {
        return this.get(`/programs/${programId}/courses/${courseId}/outline`)
    }
    // 8.2
    getCourseIdListCourseOutline = (id) => {
        return this.get(`/programs/${id}/courses`)
    }
    editCourseOutlineEditor = (programId, courseId, data) => {
        return this.put(`/programs/${programId}/courses/${courseId}/outline`, 2, data)
    }

    // 9. lecturers course outline
    getLecturerList = (page, pageSize) => {
        return this.get(`/lecturers?pageSize=${pageSize}&currentPage=${page}`)
    }

    // 10. tab course-outcomes in course outline  
    getCourseOutcomesInCourseOutline = (programId, courseId) => {
        return this.get(`/programs/${programId}/courses/${courseId}/outcome-hierarchy`)
    }

    // 11. tab details in course outline
    // 11.1 tab details in course outline
    getCourseDetailInCourseOutline = (programId, courseId, type) => {
        return this.get(`/programs/${programId}/courses/${courseId}/details?type=${type}`)
    }

    // 11.2 post new details in course outline
    postCourseDetailInCourseOutline = (programId, courseId, data) => {
        return this.post(`/programs/${programId}/courses/${courseId}/details`, 2, data)
    }

    // 11.3 edit details in course outline
    editCourseDetailInCourseOutline = (programId, courseId, id, data) => {
        return this.put(`/programs/${programId}/courses/${courseId}/details/${id}`, 2, data)
    }

    // 11.4 edit details in course outline
    deleteCourseDetailInCourseOutline = (programId, courseId, id) => {
        return this.delete(`/programs/${programId}/courses/${courseId}/details/${id}`)
    }

    // 12. PROGRAM VERSION 

    // 12.1. Get program version
    getProgramVersion = (page, searchObj = []) => {
        let searchContent = ''
        searchObj.forEach(element => {
            searchContent += `&${element.key}=${element.val}`
        });
        return this.get(`/program-instances?currentPage=${page}${searchContent}`)
    }
    // 12.2 Post new program version
    postNewProgramVersion = (data) => {
        return this.post(`/program-instances`, 2, data)
    }
    // 12.3 Edit program version
    editProgramVersion = (PGVersionId, data) => {
        return this.put(`/program-instances/${PGVersionId}`, 2, data)
    }
    // 12.4 Delete program version
    deleteProgramVersion = (PGVersionId) => {
        return this.delete(`/program-instances/${PGVersionId}`)
    }

    // 12.5 Get programIds for select
    getProgramVersionIds = () => {
        return this.get(`/programs/ids`)
    }

    // 13. Get course Instance
    getCourseInstanceProgramVersion = (programVersionInfo, page, searchObj = []) => {
        let searchContent = ''
        searchObj.forEach(element => {
            searchContent += `&${element.key}=${element.val}`
        })
        return this.get(`/program-instances/${programVersionInfo}/course-instances?currentPage=${page}${searchContent}`)
    }
    // 13.2 Post course Instance
    postNewCourseInstanceProgramVersion = (programVersionInfo, data) => {
        return this.post(`/program-instances/${programVersionInfo}/course-instances`, 2, data)
    }
    // 13.3 Edit course Instance
    editCourseInstanceProgramVersion = (programVersionInfo, courseInstanceId, data) => {
        return this.put(`/program-instances/${programVersionInfo}/course-instances/${courseInstanceId}`, 2, data)
    }
    // 13.4 Delete course Instance
    deleteCourseInstanceProgramVersion = (programVersionInfo, courseInstanceId) => {
        return this.delete(`/program-instances/${programVersionInfo}/course-instances/${courseInstanceId}`)
    }
    // 13.5 Get courseId list for select
    getCourseInstanceCourseIds = (programVersionId) => {
        return this.get(`/programs/${programVersionId}/courses`)
    }

    // 14.1 Get course outcomes from course instance
    getCourseOutcomesInCourseInstance = (programInstanceId, courseId, page, pageSize = 10, searchObj = []) => {
        let searchContent = ''
        searchObj.forEach(element => {
            searchContent += `&${element.key}=${element.val}`
        })
        return this.get(`/program-instances/${programInstanceId}/course-instances/${courseId}/outcomes?currentPage=${page}&pageSize=${pageSize}${searchContent}`)
    }
    // 14.2 post new course outcomes from course instance
    postCourseOutcomsInCourseInstance = (programInstanceId, courseId, data) => {
        return this.post(`/program-instances/${programInstanceId}/course-instances/${courseId}/outcomes`, 2, data)
    }
    // 14.3 edit course outcomes from course instance
    editCourseOutcomsInCourseInstance = (programInstanceId, courseId, outcomeName, data) => {
        return this.put(`/program-instances/${programInstanceId}/course-instances/${courseId}/outcomes/${outcomeName}`, 2, data)
    }
    // 14.4 delete course outcomes from course instance
    deleteCourseOutcomsInCourseInstance = (programInstanceId, courseId, outcomeName) => {
        return this.delete(`/program-instances/${programInstanceId}/course-instances/${courseId}/outcomes/${outcomeName}`)
    }
    // 14.5 Get Parent Outcome autocomplete
    getParentOutcomeAutocompleteInCourseInstance = (programInstanceId, courseId) => {
        return this.get(`/course-instance-outcomes?programInfo=${programInstanceId}&courseId=${courseId}`)
    }

    // 15. Get matrix outcomes-indicator
    getMatrixOutcomesIndicator = (programVersionInfo, courseId) => {
        return this.get(`/program-instances/${programVersionInfo}/course-instances/${courseId}/outcome-indicator`)
    }
    postMatrixOutcomesIndicator = (programVersionInfo, courseId, data) => {
        return this.post(`/program-instances/${programVersionInfo}/course-instances/${courseId}/outcome-indicator`, 2, data)
    }

    // 16. Course instance outline
    getCourseInstanceOutline = (programVersionInfo, courseId) => {
        return this.get(`/program-instances/${programVersionInfo}/course-instances/${courseId}/outline`)
    }
    // 16.1 Edit course instance outline
    editCourseInstanceOutline = (programVersionInfo, courseId, data) => {
        return this.put(`/program-instances/${programVersionInfo}/course-instances/${courseId}/outline`, 2,  data)
    }

    // 17. Get course outcomes instance
    getCourseOutcomesOutlineInCourseInstance = (programVersionInfo, courseId) => {
        return this.get(`/program-instances/${programVersionInfo}/course-instances/${courseId}/outcome-hierarchy`)
    }

    // 18. Get outline details in course instance
    getOutlineDetailFromCourseInstance = (programVersionInfo, courseId, type) => {
        return this.get(`/program-instances/${programVersionInfo}/course-instances/${courseId}/details?type=${type}`)
    } 
    postOutlineDetailFromCourseInstance = (programVersionInfo, courseId, data) =>
    {
        return this.post(`/program-instances/${programVersionInfo}/course-instances/${courseId}/details`, 2, data)
    }
    editOutlineDetailFromCourseInstance = (programVersionInfo, courseId, id, data) =>
    {
        return this.put(`/program-instances/${programVersionInfo}/course-instances/${courseId}/details/${id}`, 2, data)
    }
    deleteOutlineDetailFromCourseInstance = (programVersionInfo, courseId, id) => {
        return this.delete(`/program-instances/${programVersionInfo}/course-instances/${courseId}/details/${id}`)
    }
    
    // 19 get classes from course instance
    getClassesFromCourseInstance = (programVersionInfo, courseId, page, searchObj = []) => {
        let searchContent = ''
        searchObj.forEach(element => {
            searchContent += `&${element.key}=${element.val}`
        })
        return this.get(`/program-instances/${programVersionInfo}/course-instances/${courseId}/classes?currentPage=${page}${searchContent}`)
    }
    postClassesFromCourseInstance = (programVersionInfo, courseId, data) => {
        return this.post(`/program-instances/${programVersionInfo}/course-instances/${courseId}/classes`, 2, data)
    }
    editClassesFromCourseInstance = (programVersionInfo, courseId, id, data) => {
        return this.put(`/program-instances/${programVersionInfo}/course-instances/${courseId}/classes/${id}`, 2, data)
    }
    deleteClassesFromCourseInstance = (programVersionInfo, courseId, id) => {
        return this.delete(`/program-instances/${programVersionInfo}/course-instances/${courseId}/classes/${id}`)
    }

    // 20 get class assessment
    getVersionClassAssessment = (classId, page, searchObj) => {
        let searchContent = ''
        searchObj.forEach(element => {
            searchContent += `&${element.key}=${element.val}`
        })
        return this.get(`/classes/${classId}/assessment?currentPage=${page}${searchContent}`)
    }
    editVersionClassAssessment = (classId, courseOutcomeInstanceId, data) => {
        return this.put(`/classes/${classId}/assessment/${courseOutcomeInstanceId}`, 2, data)
    }

    // 21 get version class student
    getVersionClassStudent = (courseId, classId, page, searchObj) => {
        let searchContent = ''
        searchObj.forEach(element => {
            searchContent += `&${element.key}=${element.val}`
        })
        return this.get(`/course-instances/${courseId}/classes/${classId}/students?currentPage=${page}${searchContent}`)
    }
    postVersionClassStudent = (courseId, classId, data) => {
        return this.post(`/course-instances/${courseId}/classes/${classId}/students`, 2, data)
    }
    deleteVersionClassStudent = (courseId, classId, studentId) => {
        return this.delete(`/course-instances/${courseId}/classes/${classId}/students/${studentId}`)
    }
    getAllStudents = (page, size, classIdPrefix = undefined) => {
        return this.get(`/students?pageSize=${size}&currentPage=${page}${classIdPrefix ? `&classIdPrefix=${classIdPrefix}`: ''}`);
    }

    // get user
    getUsers = (page, searchObj = []) => {
        let searchContent = ''
        searchObj.forEach(element => {
            searchContent += `&${element.key}=${element.val}`
        });
        return this.get(`/users?pageSize=10&currentPage=${page}${searchContent}`)
    }
    postUser = (data) => {
        return this.post(`/users`, 2, data)
    }
    editUser = (id, data) => {
        return this.put(`/users/${id}`, 2, data)
    }
    deleteUser = (id) => {
        return this.delete(`/users/${id}`)
    }

    // 22 get student
    getStudents = (page, searchObj = []) => {
        let searchContent = ''
        searchObj.forEach(element => {
            searchContent += `&${element.key}=${element.val}`
        });
        return this.get(`/students?pageSize=10&currentPage=${page}${searchContent}`)
    }
    postStudent = (data) => {
        return this.post(`/students`, 2, data)
    }
    editStudent = (id, data) => {
        return this.put(`/students/${id}`, 2, data)
    }
    deleteStudent = (id) => {
        return this.delete(`/students/${id}`)
    }

    // 23 get lecturer
    getLecturers = (page, searchObj = []) => {
        let searchContent = ''
        searchObj.forEach(element => {
            searchContent += `&${element.key}=${element.val}`
        });
        return this.get(`/lecturers?pageSize=10&currentPage=${page}${searchContent}`)
    }
    postLecturer = (data) => {
        return this.post(`/lecturers`, 2, data)
    }
    editLecturer = (id, data) => {
        return this.put(`/lecturers/${id}`, 2, data)
    }
    deleteLecturer = (id) => {
        return this.delete(`/lecturers/${id}`)
    }

    // 24 get export to word
    getExportToWord = (programId, courseId) => {
        return this.get(`/programs/${programId}/courses/${courseId}/export`)
    }
    getExportToWordInstance = (programVersionInfo, courseId) => {
        return this.get(`/program-instances/${programVersionInfo}/course-instances/${courseId}/export`)
    }
    getExportToWordSurveyQuestion = (programVersionInfo, surveyName) => {
        return this.get(`/program-instances/${programVersionInfo}/surveys/${surveyName}/export`)
    }

    // 25 get all year && major
    getAllYear = () => {
        return this.get(`/students/years`)
    }
    getAllMajor = () => {
        return this.get(`/students/majors`)
    }
    searchStudentList = (keyword, year, major) => {
        return this.get(`/students?pageSize=10000&currentPage=1&id=${keyword}&major=${major}&year=${year}`)
    }

    // 26 get direct course instance
    getDirectCourseInstance = (page, searchObj = []) => {
        let searchContent = ''
        searchObj.forEach(element => {
            searchContent += `&${element.key}=${element.val}`
        });
        return this.get(`/course-instances?currentPage=${page}${searchContent}`)
    }

    // 27 get all programversioinfo autocomplete
    getProgramInfoList = () => {
        return this.get(`/program-instances/program-info`)
    }

    // 28 test from course instance
    getVersionCourseInstanceTest = (programVersionInfo, courseId, page, searchObj = []) => {
        let searchContent = ''
        searchObj.forEach(element => {
            searchContent += `&${element.key}=${element.val}`
        })
        return this.get(`/program-instances/${programVersionInfo}/course-instances/${courseId}/tests?currentPage=${page}${searchContent}`)
    }
    postVersionCourseInstanceTest = (programVersionInfo, courseId, data) => {
        return this.post(`/program-instances/${programVersionInfo}/course-instances/${courseId}/tests`, 2, data)
    }
    editVersionCourseInstanceTest = (programVersionInfo, courseId, id, data) => {
        return this.put(`/program-instances/${programVersionInfo}/course-instances/${courseId}/tests/${id}`, 2, data)
    }
    deleteVersionCourseInstanceTest = (programVersionInfo, courseId, id) => {
        return this.delete(`/program-instances/${programVersionInfo}/course-instances/${courseId}/tests/${id}`)
    }

    // 29 course-outcome from test from course instance
    getVersionCourseInstanceTestOutcome = (testId, page, size = 10, searchObj = []) => {
        let searchContent = ''
        searchObj.forEach(element => {
            searchContent += `&${element.key}=${element.val}`
        })
        return this.get(`/tests/${testId}/outcomes?currentPage=${page}&pageSize=${size}${searchContent}`)
    }
    postVersionCourseInstanceTestOutcome = (testId, data) => {
        return this.post(`/tests/${testId}/outcomes`, 2, data)
    }
    editVersionCourseInstanceTestOutcome = (testId, id, data) => {
        return this.put(`/tests/${testId}/outcomes/${id}`, 2, data)
    }
    deleteVersionCourseInstanceTestOutcome = (testId, id) => {
        return this.delete(`/tests/${testId}/outcomes/${id}`)
    }

    // 30 question from test from course instance
    getVersionCourseInstanceTestQuestion = (testId, page, searchObj = []) => {
        let searchContent = ''
        searchObj.forEach(element => {
            searchContent += `&${element.key}=${element.val}`
        })
        return this.get(`/tests/${testId}/questions?currentPage=${page}${searchContent}`)
    }
    postVersionCourseInstanceTestQuestion = (testId, data) => {
        return this.post(`/tests/${testId}/questions`, 2, data)
    }
    editVersionCourseInstanceTestQuestion = (testId, id, data) => {
        return this.put(`/tests/${testId}/questions/${id}`, 2, data)
    }
    deleteVersionCourseInstanceTestQuestion = (testId, id) => {
        return this.delete(`/tests/${testId}/questions/${id}`)
    }

    // 31 question outcome from test from course instance
    postVersionCourseInstanceTestQuestionOutcome = (questionId, data) => {
        return this.post(`/questions/${questionId}/outcomes`, 2, data)
    }
    editVersionCourseInstanceTestQuestionOutcome = (questionId, id, data) => {
        return this.put(`/questions/${questionId}/outcomes/${id}`, 2, data)
    }
    deleteVersionCourseInstanceTestQuestionOutcome = (questionId, id) => {
        return this.delete(`/questions/${questionId}/outcomes/${id}`)
    }

    // 32 question from test from class
    getVersionCourseInstanceClassTestQuestion = (classId, testId, page, size = 10, searchObj) => {
        let searchContent = ''
        searchObj.forEach(element => {
            searchContent += `&${element.key}=${element.val}`
        })
        return this.get(`/tests/${testId}/questions?pageSize=${size}&currentPage=${page}&classId=${classId}${searchContent}`)
    }
    // postVersionCourseInstanceTestQuestion = (testId, data) => {
    //     return this.post(`/tests/${testId}/questions`, 2, data)
    // }
    // editVersionCourseInstanceTestQuestion = (testId, id, data) => {
    //     return this.put(`/tests/${testId}/questions/${id}`, 2, data)
    // }
    // deleteVersionCourseInstanceTestQuestion = (testId, id) => {
    //     return this.delete(`/tests/${testId}/questions/${id}`)
    // }

    getVersionCourseInstanceClassTestResult = (testId, outcomeId, classId) => {
        return this.get(`/tests/${testId}/outcomes/${outcomeId}/grading?classId=${classId}`)
    }

    deleteVersionCourseInstanceClassTestResult = (testId, outcomeId, data) => {
        return this.delete(`/tests/${testId}/outcomes/${outcomeId}/grading`, data)
    }
    getVersionCourseInstanceClassAll = (programVersionInfo, courseId) => {
        return this.get(`/program-instances/${programVersionInfo}/course-instances/${courseId}/classes?pageSize=1000&currentPage=1`)
    }
    postVersionCourseInstanceClassTestResult = (testId, outcomeId, classId, data) => {
        return this.post(`/tests/${testId}/outcomes/${outcomeId}/grading?classId=${classId}`, 3, data)
    }
    // 33 version thesis

    getVersionThesis = (programVersionInfo, page, searchObj = []) => {
        let searchContent = ''
        searchObj.forEach(element => {
            searchContent += `&${element.key}=${element.val}`
        })
        return this.get(`/program-instances/${programVersionInfo}/theses?currentPage=${page}${searchContent}`)
    }
    postVersionThesis = (programVersionInfo, data) => {
        return this.post(`/program-instances/${programVersionInfo}/theses`, 2, data)
    }
    editVersionThesis = (programVersionInfo, id, data) => {
        return this.put(`/program-instances/${programVersionInfo}/theses/${id}`, 2, data)
    }
    deleteVersionThesis = (programVersionInfo, id) => {
        return this.delete(`/program-instances/${programVersionInfo}/theses/${id}`)
    }

    // 34 version thesis lecturer

    postVersionThesisLecturer = (programVersionInfo, projectId, data) => {
        return this.post(`/program-instances/${programVersionInfo}/theses/${projectId}/lecturers`, 2, data)
    }
    editVersionThesisLecturer = (programVersionInfo, projectId, id, data) => {
        return this.put(`/program-instances/${programVersionInfo}/theses/${projectId}/lecturers/${id}`, 2, data)
    }
    deleteVersionThesisLecturer = (programVersionInfo, projectId, id) => {
        return this.delete(`/program-instances/${programVersionInfo}/theses/${projectId}/lecturers/${id}`)
    }

    // 35 version survey

    getVersionSurvey = (programVersionInfo, page, searchObj = []) => {
        let searchContent = ''
        searchObj.forEach(element => {
            searchContent += `&${element.key}=${element.val}`
        })
        return this.get(`/program-instances/${programVersionInfo}/surveys?currentPage=${page}${searchContent}`)
    }
    postVersionSurvey = (programVersionInfo, data) => {
        return this.post(`/program-instances/${programVersionInfo}/surveys`, 2, data)
    }
    editVersionSurvey = (programVersionInfo, name, data) => {
        return this.put(`/program-instances/${programVersionInfo}/surveys/${name}`, 2, data)
    }
    deleteVersionSurvey = (programVersionInfo, name) => {
        return this.delete(`/program-instances/${programVersionInfo}/surveys/${name}`)
    }

    getSurveys = (page, searchObj = []) => {
        let searchContent = ''
        searchObj.forEach(element => {
            searchContent += `&${element.key}=${element.val}`
        });
        return this.get(`/surveys?currentPage=${page}${searchContent}`)
    }

    getKindAndTypeSurvey = (page, size) => {
        return this.get(`/survey-kinds?pageSize=${size}&currentPage=${page}`)
    }

    // survey question
    getVersionSurveyQuestion = (programVersionInfo, surveyName, page, searchObj = []) => {
        let searchContent = ''
        searchObj.forEach(element => {
            searchContent += `&${element.key}=${element.val}`
        })
        return this.get(`/program-instances/${programVersionInfo}/surveys/${surveyName}/questions?currentPage=${page}${searchContent}`)
    }
    postVersionSurveyQuestion = (programVersionInfo, surveyName, data) => {
        return this.post(`/program-instances/${programVersionInfo}/surveys/${surveyName}/questions`, 2, data)
    }
    editVersionSurveyQuestion = (programVersionInfo, surveyName, id, data) => {
        return this.put(`/program-instances/${programVersionInfo}/surveys/${surveyName}/questions/${id}`, 2, data)
    }
    deleteVersionSurveyQuestion = (programVersionInfo, surveyName, id) => {
        return this.delete(`/program-instances/${programVersionInfo}/surveys/${surveyName}/questions/${id}`)
    }
    getAllOutcomeList = (programId) => {
        return this.get(`/programs/${programId}/outcomes?pageSize=10000&currentPage=1`)
    }
    postVersionSurveyQuestionAnswer = (programVersionInfo, surveyName, id, data) => {
        return this.post(`/program-instances/${programVersionInfo}/surveys/${surveyName}/questions/${id}/answers`, 2, data)
    }
    editVersionSurveyQuestionAnswer = (programVersionInfo, surveyName, id, levelId, data) => {
        return this.put(`/program-instances/${programVersionInfo}/surveys/${surveyName}/questions/${id}/answers/${levelId}`, 2, data)
    }
    deleteVersionSurveyQuestionAnswer = (programVersionInfo, surveyName, id, levelId) => {
        return this.delete(`/program-instances/${programVersionInfo}/surveys/${surveyName}/questions/${id}/answers/${levelId}`)
    }

    // foundation test subject
    getVersionFoundationTestSubject = (programVersionInfo,  page, size, searchObj) => {
        let searchContent = ''
        searchObj?.forEach(element => {
            searchContent += `&${element.key}=${element.val}`
        })
        return this.get(`/program-instances/${programVersionInfo}/foundation-tests/${programVersionInfo}-FoundationTest/subjects?pageSize=${size}&currentPage=${page}${searchContent}`)
    }
    postVersionFoundationTestSubject = (programVersionInfo, data) => {
        return this.post(`/program-instances/${programVersionInfo}/foundation-tests/${programVersionInfo}-FoundationTest/subjects`, 2, data)
    }
    deleteVersionFoundationTestSubject = (programVersionInfo, id) => {
        return this.delete(`/program-instances/${programVersionInfo}/foundation-tests/${programVersionInfo}-FoundationTest/subjects/${id}`)
    }
    getSubjects = (page, size) => {
        return this.get(`/subjects?pageSize=${page}&currentPage=${size}`)
    }

    // foundation test question
    getVersionFoundationTestQuestion = (programVersionInfo,  page, size, searchObj) => {
        let searchContent = ''
        searchObj.forEach(element => {
            searchContent += `&${element.key}=${element.val}`
        })
        return this.get(`/program-instances/${programVersionInfo}/foundation-tests/${programVersionInfo}-FoundationTest/questions?pageSize=${size}&currentPage=${page}${searchContent}`)
    }
    postVersionFoundationTestQuestion = (programVersionInfo, data) => {
        return this.post(`/program-instances/${programVersionInfo}/foundation-tests/${programVersionInfo}-FoundationTest/questions`, 3, data)
    }
    editVersionFoundationTestQuestion = (programVersionInfo, data, id) => {
        return this.put(`/program-instances/${programVersionInfo}/foundation-tests/${programVersionInfo}-FoundationTest/questions/${id}`, 3, data)
    }
    deleteVersionFoundationTestQuestion = (programVersionInfo, id) => {
        return this.delete(`/program-instances/${programVersionInfo}/foundation-tests/${programVersionInfo}-FoundationTest/questions/${id}`)
    }

    getAllIndicatorsByOutcomeList = (programId, outcomeName, page, size) => {
        return this.get(`/programs/${programId}/outcomes/${outcomeName}/indicators?pageSize=${size}&currentPage=${page}`)
    }
    // foundation test question answer

    postVersionFoundationTestQuestionAnswer = (programVersionInfo, data, questionId) => {
        return this.post(`/program-instances/${programVersionInfo}/foundation-tests/${programVersionInfo}-FoundationTest/questions/${questionId}/answers`, 3, data)
    }
    editVersionFoundationTestQuestionAnswer = (programVersionInfo, data, questionId, answerId) => {
        return this.put(`/program-instances/${programVersionInfo}/foundation-tests/${programVersionInfo}-FoundationTest/questions/${questionId}/answers/${answerId}`, 3, data)
    }
    deleteVersionFoundationTestQuestionAnswer = (programVersionInfo, questionId, answerId) => {
        return this.delete(`/program-instances/${programVersionInfo}/foundation-tests/${programVersionInfo}-FoundationTest/questions/${questionId}/answers/${answerId}`)
    }

    // foundation test question result
    getVersionFoundationTestResult = (programVersionInfo, page) => {
        return this.get(`/program-instances/${programVersionInfo}/foundation-tests/${programVersionInfo}-FoundationTest/result?currentPage=${page}&pageSize=20`)
    }

    getVersionFoundationTestResultAnswer = (programVersionInfo, questionNum) => {
        return this.get(`/program-instances/${programVersionInfo}/foundation-tests/${programVersionInfo}-FoundationTest/questions/${programVersionInfo}-FoundationTest-${questionNum}/answers`)
    }
    postVersionFoundationTestResult = (programVersionInfo, data) => {
        return this.post(`/program-instances/${programVersionInfo}/foundation-tests/${programVersionInfo}-FoundationTest/result`, 2, data)
    }
    importFileVersionFoundationTestResult = (programVersionInfo, formData) => {
        return this.post(`/program-instances/${programVersionInfo}/foundation-tests/${programVersionInfo}-FoundationTest/result/import`, 3, formData)
    }

    // survey result
    getVersionSurveyResult = (programVersionInfo, surveyName, surveyType, page) => {
        return this.get(`/program-instances/${programVersionInfo}/surveys/${surveyName}/${surveyType}-result?currentPage=${page}&pageSize=20`)
    }
    postVersionSurveyResult = (programVersionInfo, surveyName, surveyType, data) => {
        return this.post(`/program-instances/${programVersionInfo}/surveys/${surveyName}/${surveyType}-result`, 2, data)
    }
    deleteVersionSurveyResult = (programVersionInfo, surveyName, surveyType, data) => {
        return this.delete(`/program-instances/${programVersionInfo}/surveys/${surveyName}/${surveyType}-result`, data)
    }

    getVersionSurveyResultStat = (programVersionInfo, surveyName, surveyType) => {
        return this.get(`/program-instances/${programVersionInfo}/surveys/${surveyName}/${surveyType}-result/stat`)
    }
    editVersionSurveyResultStat = (programVersionInfo, surveyName, surveyType, data) => {
        return this.put(`/program-instances/${programVersionInfo}/surveys/${surveyName}/${surveyType}-result/stat`, 2, data)
    }
    getVersionSurveyResultStatOptions = () => {
        return this.get(`/survey/levels`)
    }
    getVersionSurveyResultAnswerOptions = (programVersionInfo, surveyName, surveyIndicatorId) => {
        return this.get(`/program-instances/${programVersionInfo}/surveys/${surveyName}/questions/${surveyIndicatorId}/answers`)
    }

    // import file for supervisor result
    postImportFileSupervisorResult = (programVersionInfo, surveyName, surveyType, data) => {
        return this.post(`/program-instances/${programVersionInfo}/surveys/${surveyName}/${surveyType}-result/import`, 3, data)
    }

    // subjects
    getSubjectsSideBar = (page, searchObj = []) => {
        let searchContent = ''
        searchObj.forEach(element => {
            searchContent += `&${element.key}=${element.val}`
        })
        return this.get(`/subjects?currentPage=${page}${searchContent}`)
    }
    postSubjectsSideBar = (data) => {
        return this.post(`/subjects`, 2, data)
    }
    editSubjectsSideBar = (id, data) => {
        return this.put(`/subjects/${id}`, 2, data)
    }
    deleteSubjectsSideBar = (id) => {
        return this.delete(`/subjects/${id}`)
    }

    // statistic
    getSubjectStat = (programVersionInfo) => {
        return this.get(`/program-instances/${programVersionInfo}/foundation-tests/${programVersionInfo}-FoundationTest/stat/subject`)
    }
    getGradeStat = (programVersionInfo) => {
        return this.get(`/program-instances/${programVersionInfo}/foundation-tests/${programVersionInfo}-FoundationTest/stat/grade`)
    }
    getGradeByYearStat = (programVersionInfo, year) => {
        return this.get(`/program-instances/${programVersionInfo}/foundation-tests/${programVersionInfo}-FoundationTest/stat/grade?year=${year}`)
    }
    getYearStat = (programVersionInfo) => {
        return this.get(`/program-instances/${programVersionInfo}/foundation-tests/${programVersionInfo}-FoundationTest/stat/year`)
    }
    getYearByGradeStat = (programVersionInfo, grade) => {
        return this.get(`/program-instances/${programVersionInfo}/foundation-tests/${programVersionInfo}-FoundationTest/stat/year?grade=${grade}`)
    }
    getAnswerStat = (programVersionInfo) => {
        return this.get(`/program-instances/${programVersionInfo}/foundation-tests/${programVersionInfo}-FoundationTest/stat/correct-answer`)
    }
    getOutcomeStat = (programVersionInfo) => {
        return this.get(`/program-instances/${programVersionInfo}/foundation-tests/${programVersionInfo}-FoundationTest/stat/outcome`)
    }
    getIndicatorStat = (programVersionInfo) => {
        return this.get(`/program-instances/${programVersionInfo}/foundation-tests/${programVersionInfo}-FoundationTest/stat/indicator`)
    }
}

export const programService = new ProgramService();
