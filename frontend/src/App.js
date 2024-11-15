// Thu vien giup chuyen huong trang
import './App.css'
import { Router, Switch } from "react-router-dom";
import { createBrowserHistory } from "history";
// Component
// import Loading from "./components/loading/Loading";
import HomeTemplate from "./templates/HomeTemplate/HomeTemplate";
import Subjects from './pages/subjects/Subjects'
import Lecturer from './pages/lecturer/Lecturer'
import Student from './pages/student/Student'
import Guideline from './pages/guideline/Guideline.js'
import Feedback from './pages/feedback/Feedback'
import { useDispatch } from 'react-redux';

// import UserTemplate from "./templates/UserTemplate/UserTemplate";
import Login from "./pages/login/Login";
import { ACCESSTOKEN } from './util/SettingSystem';
import { getInfoActionApi } from './actions/api-actions/UserAction';
import UserProfile from './components/user-profile/UserProfile';
import CompanyProfile from './components/company-profile/CompanyProfile';
import DrawerForm from './components/drawer-form/DrawerForm';
import GeneralProgram from './pages/program/general-program/GeneralProgram';
import GeneralCourse from './pages/courses/GeneralCourse';
import CourseInstance from './pages/courses/CourseInstance';
import Survey from './pages/survey/Survey';
import Report from './pages/report/Report';
import Users from './pages/administration/Users';
import Roles from './pages/administration/Roles';
import Attributes from './pages/administration/Attributes';
import { IntlProvider } from "react-intl";
import * as Translation from "./util/Translation";
import { connect } from "react-redux";
import Loading from './components/loading/Loading';
import Program from './pages/program/program/Program';
import PGPeos from './pages/program/program/sub-program/peos/PGPeos';
import PGOutcome from './pages/program/program/sub-program/outcome/PGOutcome';
import PGCurriculum from './pages/program/program/sub-program/curriculum/PGCurriculum';
import PGMatrixPeo from './pages/program/program/sub-program/matrix-peo/PGMatrixPeo';
import PGMatrixCourse from './pages/program/program/sub-program/matrix-course/PGMatrixCourse';
import Indicator from './pages/program/program/sub-program/outcome/indicator/Indicator';
import CurCourse from './pages/program/program/sub-program/curriculum/course/CurCourse';
import CourseOutcome from './pages/program/program/sub-program/curriculum/course/course-outcome/CourseOutcome';
import CourseOutline from './pages/program/program/sub-program/curriculum/course/course-outline/CourseOutline';
import ProgramVersion from './pages/program/program-version/ProgramVersion';
import Course from './pages/program/program-version/sub-program-version/course/Course';
import AccessmentReport from './pages/program/program-version/sub-program-version/accessment-report/AccessmentReport';
import FoundationTest from './pages/program/program-version/sub-program-version/foundation-test/FoundationTest';
import SurveyReport from './pages/program/program-version/sub-program-version/survey-report/SurveyReport';
import SurveyVS from './pages/program/program-version/sub-program-version/survey-vs/SurveyVS';
import ThesisVS from './pages/program/program-version/sub-program-version/thesis-vs/ThesisVS';
import MaxtrixOutcomeIndicator from './pages/program/program-version/sub-program-version/course/MaxtrixOutcomeIndicator/MaxtrixOutcomeIndicator';
import VersionCourseOutcomes from './pages/program/program-version/sub-program-version/course/version-course-outcome/VersionCourseOutcomes';
import MatrixOutcomeTest from './pages/program/program-version/sub-program-version/course/MatricOutcomeTest/MatrixOutcomeTest';
import CourseOutlineInstance from './pages/program/program-version/sub-program-version/course/course-outline/CourseOutlineInstance';
import VersionAccessment from './pages/program/program-version/sub-program-version/course/version-assessment/VersionAccessment';
import VersionClasses from './pages/program/program-version/sub-program-version/course/version-classes/VersionClasses';
import ClassAssessment from './pages/program/program-version/sub-program-version/course/version-classes/class-assessment/ClassAssessment';
import ClassStudent from './pages/program/program-version/sub-program-version/course/version-classes/class-student/ClassStudent';
import VersionCourseTest from './pages/program/program-version/sub-program-version/course/version-course-test/VersionCourseTest';
import TestCourseOutcome from './pages/program/program-version/sub-program-version/course/version-course-test/test-course-outcome/TestCourseOutcome';
import TestQuestion from './pages/program/program-version/sub-program-version/course/version-course-test/test-question/TestQuestion';
import ClassTest from './pages/program/program-version/sub-program-version/course/version-classes/class-test/ClassTest';
import ClassTestCourseOutcome from './pages/program/program-version/sub-program-version/course/version-classes/class-test/ClassTestCourseOutcome';
import ClassTestQuestion from './pages/program/program-version/sub-program-version/course/version-classes/class-test/ClassTestQuestion';
import ClassTestResult from './pages/program/program-version/sub-program-version/course/version-classes/class-test/ClassTestResult';
import SurveyQuestion from './pages/program/program-version/sub-program-version/survey-vs/SurveyQuestion';
import ViewContent from './pages/program/program-version/sub-program-version/foundation-test/ViewContent';
import Supervisor from './pages/program/program-version/sub-program-version/survey-vs/supervisor/Supervisor';
import Reviewer from './pages/program/program-version/sub-program-version/survey-vs/reviewer/Reviewer';
import Member from './pages/program/program-version/sub-program-version/survey-vs/member/Member';
import Internship from './pages/program/program-version/sub-program-version/survey-vs/internship/Internship';
import Exit from './pages/program/program-version/sub-program-version/survey-vs/exit/Exit';
import Participant from './pages/program/program-version/sub-program-version/survey-vs/participant/Participant';
import CeHd from './pages/program/program-version/sub-program-version/survey-vs/ce-hd/CeHd';
import CeParticipant from './pages/program/program-version/sub-program-version/survey-vs/ce-participant/CeParticipant';
import CeSupervisor from './pages/program/program-version/sub-program-version/survey-vs/ce-supervisor/CeSupervisor';
import Committee from './pages/program/program-version/sub-program-version/survey-vs/committee/Committee';
import TestResult from './pages/program/program-version/sub-program-version/course/version-course-test/test-result/TestResult';
import ViewStat from './pages/program/program-version/sub-program-version/foundation-test/ViewStat';
import SignUp from './pages/signup/SignUp';


const messages = {
  vi: Translation.messagesVi,
  en: Translation.messagesEn,
};

export const history = createBrowserHistory();

function App(props) {
  const { lang } = props;
  const dispatch = useDispatch()
  if(localStorage.getItem(ACCESSTOKEN)) {
    dispatch(getInfoActionApi(localStorage.getItem(ACCESSTOKEN)))
  } else {
    history.push('/login')
  }

  return (
    <IntlProvider locale={lang} messages={messages[lang]} key={lang}>
      <Router history={history}>
      {/* Commom component */}
      <Loading />
      <DrawerForm />
      <Switch>
        {/* hometemplate */} 
        
        {/* GENERAL PROGRAM */}

        <HomeTemplate exact path="/general-program" component={GeneralProgram} />
        <HomeTemplate exact path="/" component={GeneralProgram} />
        <HomeTemplate exact path="/general-program/:id/program" component={Program} />
        <HomeTemplate exact path="/general-program/:generalProgramId/program/:programId/peos" component={PGPeos} />
        <HomeTemplate exact path="/general-program/:generalProgramId/program/:programId/program-outcome" component={PGOutcome} />
        <HomeTemplate exact path="/general-program/:generalProgramId/program/:programId/program-outcome/:outcomeName/indicator" component={Indicator} />
        <HomeTemplate exact path="/general-program/:generalProgramId/program/:programId/curriculum" component={PGCurriculum} />
        <HomeTemplate exact path="/general-program/:generalProgramId/program/:programId/curriculum/:curriculumId/course" component={CurCourse} />
        <HomeTemplate exact path="/general-program/:generalProgramId/program/:programId/curriculum/:curriculumId/course/:courseId/outcome" component={CourseOutcome} />
        <HomeTemplate exact path="/general-program/:generalProgramId/program/:programId/curriculum/:curriculumId/course/:courseId/outline" component={CourseOutline} />
        <HomeTemplate exact path="/general-program/:generalProgramId/program/:programId/matrix-peo" component={PGMatrixPeo} />
        <HomeTemplate exact path="/general-program/:generalProgramId/program/:programId/matrix-course" component={PGMatrixCourse} />

        {/* PROGRAM VERSION */}

        <HomeTemplate exact path="/program-version" component={ProgramVersion} />
        <HomeTemplate exact path="/program-version/:programVersionInfo/course-instances" component={Course} />
        <HomeTemplate exact path="/program-version/:programVersionInfo/course-instances/:courseId/outcomes" component={VersionCourseOutcomes} />
        <HomeTemplate exact path="/program-version/:programVersionInfo/course-instances/:courseId/Outcomes-Indicator" component={MaxtrixOutcomeIndicator} />
        <HomeTemplate exact path="/program-version/:programVersionInfo/course-instances/:courseId/Outcomes-Test" component={MatrixOutcomeTest} />
        <HomeTemplate exact path="/program-version/:programVersionInfo/course-instances/:courseId/course-outline" component={CourseOutlineInstance} />
        <HomeTemplate exact path="/program-version/:programVersionInfo/course-instances/:courseId/assessment" component={VersionAccessment} />
        <HomeTemplate exact path="/program-version/:programVersionInfo/course-instances/:courseId/test" component={VersionCourseTest} />
        <HomeTemplate exact path="/program-version/:programVersionInfo/course-instances/:courseId/test/:testId/course-outcome" component={TestCourseOutcome} />
        <HomeTemplate exact path="/program-version/:programVersionInfo/course-instances/:courseId/test/:testId/question" component={TestQuestion} />
        <HomeTemplate exact path="/program-version/:programVersionInfo/course-instances/:courseId/test/:testId/result" component={TestResult} />
        <HomeTemplate exact path="/program-version/:programVersionInfo/course-instances/:courseId/classes" component={VersionClasses} />
        <HomeTemplate exact path="/program-version/:programVersionInfo/course-instances/:courseId/classes/:classId/assessment" component={ClassAssessment} />
        <HomeTemplate exact path="/program-version/:programVersionInfo/course-instances/:courseId/classes/:classId/student" component={ClassStudent} />
        <HomeTemplate exact path="/program-version/:programVersionInfo/course-instances/:courseId/classes/:classId/test" component={ClassTest} />
        <HomeTemplate exact path="/program-version/:programVersionInfo/course-instances/:courseId/classes/:classId/test/:testId/course-outcome" component={ClassTestCourseOutcome} />
        <HomeTemplate exact path="/program-version/:programVersionInfo/course-instances/:courseId/classes/:classId/test/:testId/question" component={ClassTestQuestion} />
        <HomeTemplate exact path="/program-version/:programVersionInfo/course-instances/:courseId/classes/:classId/test/:testId/result" component={ClassTestResult} />

        {/* GENERAL COURSE */}
        <HomeTemplate exact path="/general-course" component={GeneralCourse} />

        {/* COURSE INSTANCE OUTSIDE */}
        <HomeTemplate exact path="/course-instance" component={CourseInstance} />

        <HomeTemplate exact path="/program-version/:programVersionInfo/foundation-test" component={FoundationTest} />
        <HomeTemplate exact path="/program-version/:programVersionInfo/foundation-test/question-content" component={ViewContent} />
        <HomeTemplate exact path="/program-version/:programVersionInfo/foundation-test/stat" component={ViewStat} />
        <HomeTemplate exact path="/program-version/:programVersionInfo/thesis" component={ThesisVS} />
        <HomeTemplate exact path="/program-version/:programVersionInfo/survey" component={SurveyVS} />
        <HomeTemplate exact path="/program-version/:programVersionInfo/survey/:surveyName/questions" component={SurveyQuestion} />
        <HomeTemplate exact path="/program-version/:programVersionInfo/survey/:surveyName-1/result" component={Supervisor} />
        <HomeTemplate exact path="/program-version/:programVersionInfo/survey/:surveyName-2/result" component={Reviewer} />
        <HomeTemplate exact path="/program-version/:programVersionInfo/survey/:surveyName-3/result" component={Member} />
        <HomeTemplate exact path="/program-version/:programVersionInfo/survey/:surveyName-4/result" component={Participant} />
        <HomeTemplate exact path="/program-version/:programVersionInfo/survey/:surveyName-6/result" component={Internship} />
        <HomeTemplate exact path="/program-version/:programVersionInfo/survey/:surveyName-5/result" component={Exit} />
        <HomeTemplate exact path="/program-version/:programVersionInfo/survey/:surveyName-8/result" component={CeHd} />
        <HomeTemplate exact path="/program-version/:programVersionInfo/survey/:surveyName-9/result" component={CeParticipant} />
        <HomeTemplate exact path="/program-version/:programVersionInfo/survey/:surveyName-10/result" component={CeSupervisor} />
        <HomeTemplate exact path="/program-version/:programVersionInfo/survey/:surveyName-11/result" component={Committee} />
        <HomeTemplate exact path="/program-version/:programVersionInfo/assessment-report" component={AccessmentReport} />
        <HomeTemplate exact path="/program-version/:programVersionId/survey-report" component={SurveyReport} />

        
        <HomeTemplate exact path="/subjects" component={Subjects} />
        <HomeTemplate exact path="/lecturer" component={Lecturer} />
        <HomeTemplate exact path="/student" component={Student} />
        <HomeTemplate exact path="/survey" component={Survey} />
        <HomeTemplate exact path="/guideline" component={Guideline} />
        <HomeTemplate exact path="/feedback" component={Feedback} />
        <HomeTemplate exact path="/report" component={Report} />
        <HomeTemplate exact path="/users" component={Users} />
        <HomeTemplate exact path="/roles" component={Roles} />
        <HomeTemplate exact path="/attributes" component={Attributes} />
        <HomeTemplate exact path="/user-profile" component={UserProfile} />
        <HomeTemplate exact path="/company-profile" component={CompanyProfile} />
        <Login exact path='/login' />
        <SignUp exact path='/signup' />
      </Switch>
    </Router>
    </IntlProvider>
  );
}

const mapStateToProps = state => ({
  lang: state.UserReducer.lang,
});
export default connect(mapStateToProps)(App);
// export default App;
