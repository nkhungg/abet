import React from "react";
import { withFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "react-redux";
import {
  deleteVersionSurveyQuestionAnswerActionApi,
  editVersionSurveyQuestionAnswerActionApi,
  postVersionSurveyQuestionAnswerActionApi,
} from "../../actions/api-actions/ProgramAction";
import { Popconfirm } from "antd";
import { Select } from "antd";

const { Option } = Select;
const textConfirm = "Are you sure to delete this task?";

function FormVersionSurveyQuestionAnswer(props) {
  const dispatch = useDispatch();
  const { values, handleChange, handleSubmit, setFieldValue } = props;

  const {
    selectedFlowProgramVersion,
  } = useSelector((state) => state.GeneralProgramReducer);

  const { programVersionInfo, surveyName } = selectedFlowProgramVersion;

  const confirmDelete = (values) => {
    let valueUpdate = { ...values, programVersionInfo, surveyName };
    dispatch(deleteVersionSurveyQuestionAnswerActionApi(valueUpdate))
  };

  const changeMaxGradeFlag = (e) => {
    setFieldValue("maxGradeFlag", +e);
  };

  const changeMinGradeFlag = (e) => {
    setFieldValue("minGradeFlag", +e);
  };

  return (
    <div>
      <form className="form-create-course" onSubmit={handleSubmit}>
        <div className="col-12">
          <div className="form-group">
            <label htmlFor="levelId">
              Level Id:{" "}
              <span className="text-danger font-weight-bold">*</span>
            </label>
            <input
              name="levelId"
              value={values.levelId || ""}
              onChange={handleChange}
              className="form-control"
              type="text"
              disabled={props.editVersionSurveyQuestionAnswer.isEdit}
            />
          </div>
        </div>


        <div className="col-12">
          <div className="form-group">
            <label htmlFor="description">
              Description: <span className="text-danger font-weight-bold">*</span>
            </label>
            <input
              name="description"
              value={values.description || ""}
              onChange={handleChange}
              className="form-control"
              type="text"
            />
          </div>
        </div>

        <div className="row col-12">
          <div className="col-6">
            <div className="form-group d-flex justify-content-start align-items-center">
              <label htmlFor="minGrade" style={{minWidth: '80px'}}>
                Min Grade: 
              </label>
              <input
                style={{minWidth: '80px'}}
                name="minGrade"
                value={values.minGrade || ""}
                onChange={handleChange}
                className="form-control"
                type="number"
                step="0.01"
              />
            </div>
          </div>

          <div className="col-6">
            <div className="form-group d-flex justify-content-start align-items-center">
              <label htmlFor="minGradeFlag" style={{minWidth: '110px'}}>
                Min Grade Flag: 
              </label>
              <Select
                size="default"
                style={{minWidth: '70px'}}
                onChange={(e) => changeMinGradeFlag(e)}
                className="general-select-ant"
                defaultValue={+values.minGradeFlag === 1 ? "<" : (+values.minGradeFlag === 2 ? "<=" : "=")}
              >
                <Option value="0">=</Option>
                <Option value="1">&lt;</Option>
                <Option value="2">&le;</Option>
              </Select>
            </div>
          </div>
        </div>


        <div className="row col-12">
          <div className="col-6">
            <div className="form-group d-flex justify-content-start align-items-center">
              <label htmlFor="maxGrade" style={{minWidth: '80px'}}>
                Max Grade: 
              </label>
              <input
              style={{minWidth: '80px'}}
                name="maxGrade"
                value={values.maxGrade || ""}
                onChange={handleChange}
                className="form-control"
                type="number"
                step="0.01"
              />
            </div>
          </div>

          <div className="col-6">
            <div className="form-group d-flex justify-content-start align-items-center">
              <label htmlFor="maxGradeFlag" style={{minWidth: '110px'}}>
                Max Grade Flag: 
              </label>
              <Select
                size="default"
                style={{minWidth: '70px'}}
                onChange={(e) => changeMaxGradeFlag(e)}
                className="general-select-ant"
                defaultValue={+values.maxGradeFlag === 1 ? "<" : (+values.maxGradeFlag === 2 ? "<=" : "=")}
              >
                <Option value="0">=</Option>
                <Option value="1">&lt;</Option>
                <Option value="2">&le;</Option>
              </Select>
            </div>
          </div>
        </div>


        <div className="col-12 mt-5 d-flex justify-content-center">
          {props.editVersionSurveyQuestionAnswer.isEdit ? (
            <Popconfirm
              placement="topLeft"
              title={textConfirm}
              onConfirm={() => confirmDelete(values)}
              okText="Yes"
              cancelText="No"
            >
              <button type="button" className="btn btn-danger mr-5">
                Delete
              </button>
            </Popconfirm>
          ) : (
            ""
          )}
          <button type="submit" className="btn btn-primary mr-2">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

const FormVersionSurveyQuestionAnswerFormik = withFormik({
  enableReinitialize: true,
  mapPropsToValues: (props) => {
    const { editVersionSurveyQuestionAnswer } = props;
    return {
      levelId: editVersionSurveyQuestionAnswer?.levelId,
      id: editVersionSurveyQuestionAnswer?.id,

      description: editVersionSurveyQuestionAnswer?.description,

      minGrade: editVersionSurveyQuestionAnswer?.minGrade, // input number
      maxGrade: editVersionSurveyQuestionAnswer?.maxGrade, // input number decimal
      minGradeFlag: editVersionSurveyQuestionAnswer?.minGradeFlag, // select
      maxGradeFlag: editVersionSurveyQuestionAnswer?.maxGradeFlag, // select
    };
  },
  validationSchema: Yup.object().shape({}),
  handleSubmit: (values, { props, setSubmitting }) => {
    let { editVersionSurveyQuestionAnswer, selectedFlowProgramVersion, dispatch } = props;
    let { programVersionInfo, surveyName } = selectedFlowProgramVersion;
    let valueUpdate = { ...values, programVersionInfo, surveyName, comment: values.comment ? 1 : 0 }
    if (editVersionSurveyQuestionAnswer.isEdit) {
      dispatch(editVersionSurveyQuestionAnswerActionApi(valueUpdate))
    } else {
      dispatch(postVersionSurveyQuestionAnswerActionApi(valueUpdate))
    }
  },
})(FormVersionSurveyQuestionAnswer);

const mapStateToProps = (state) => ({
  editVersionSurveyQuestionAnswer: state.GeneralProgramReducer.editVersionSurveyQuestionAnswer,
  selectedFlowProgramVersion:
    state.GeneralProgramReducer.selectedFlowProgramVersion,
});

export default connect(mapStateToProps)(FormVersionSurveyQuestionAnswerFormik);
