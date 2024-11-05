import React, { useEffect } from "react";
import { withFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "react-redux";
import {
  deleteVersionCourseInstanceTestQuestionOutcomeActionApi,
  editVersionCourseInstanceTestQuestionOutcomeActionApi,
  getVersionCourseInstanceTestOutcomeActionApi,
  postVersionCourseInstanceTestQuestionOutcomeActionApi,
} from "../../actions/api-actions/ProgramAction";
import { Popconfirm } from "antd";
import { Select } from "antd";

const { Option } = Select;
const textConfirm = "Are you sure to delete this task?";

function FormVersionCourseInstanceTestQuestionOutcome(props) {
  const dispatch = useDispatch();
  const { values, handleChange, handleSubmit, setFieldValue } = props;

  const {
    selectedFlowProgramVersion,
    versionCourseIntanceTestCourseOutcome,
  } = useSelector((state) => state.GeneralProgramReducer);

  const { testId, classId } = selectedFlowProgramVersion;

  useEffect(() => {
    dispatch(getVersionCourseInstanceTestOutcomeActionApi(testId, 1, 3000));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testId]);

  const confirmDelete = (values) => {
    let valueUpdate = { ...values, testId, classId };
    dispatch(
      deleteVersionCourseInstanceTestQuestionOutcomeActionApi(valueUpdate)
    );
  };

  const renderCourseOutcome = () => {
    return versionCourseIntanceTestCourseOutcome?.data?.map((item, idx) => {
      return (
        <Option value={`${item.courseOutcomeId}-${item.name}`} key={`${item.courseOutcomeId}`}>
          {item.name} - {item.description}
        </Option>
      );
    });
  };

  const onChangeSelectLecturers = (e) => {
    let outcome = e.split("-");
    setFieldValue("courseOutcomeId", outcome[0]);
    setFieldValue("courseOutcomeName", outcome[1]);
  };

  return (
    <div>
      <form className="form-create-course" onSubmit={handleSubmit}>
      { !props.editVersionCourseInstanceTestQuestionOutcome.isEdit && <div className="col-12">
          <div className="form-group">
            <label htmlFor="description">
              Course Outcome:{" "}
              <span className="text-danger font-weight-bold">*</span>
            </label>
            <Select
              size="default"
              placeholder="Please select"
              onChange={(e) => onChangeSelectLecturers(e)}
              style={{ width: "100%" }}
              className="general-select-ant mb-4"
              filterOption={(keyword, option) =>
                option.children
                  .toString()
                  .toLowerCase()
                  .includes(keyword.toLowerCase())
              }
            >
              {renderCourseOutcome()}
            </Select>
          </div>
        </div>}
        

        <div className="col-12">
          <div className="form-group">
            <label htmlFor="percent">
              Percent: <span className="text-danger font-weight-bold">*</span>
            </label>
            <input
              name="percent"
              value={values.percent || ""}
              onChange={handleChange}
              className="form-control"
              type="number"
            />
          </div>
        </div>

        <div className="col-12">
          <div className="form-group">
            <label htmlFor="comment">
              Comment: <span className="text-danger font-weight-bold">*</span>
            </label>
            <input
              name="comment"
              value={values.comment || ""}
              onChange={handleChange}
              className="form-control"
              type="text"
            />
          </div>
        </div>

        <div className="col-12 mt-5 d-flex justify-content-center">
          {props.editVersionCourseInstanceTestQuestionOutcome.isEdit ? (
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

const FormVersionCourseInstanceTestQuestionOutcomeFormik = withFormik({
  enableReinitialize: true,
  mapPropsToValues: (props) => {
    const { editVersionCourseInstanceTestQuestionOutcome } = props;
    return {
      percent: editVersionCourseInstanceTestQuestionOutcome?.percent,
      courseOutcomeName:
        editVersionCourseInstanceTestQuestionOutcome?.courseOutcomeName,
      comment: editVersionCourseInstanceTestQuestionOutcome?.comment,
      courseOutcomeId:
        editVersionCourseInstanceTestQuestionOutcome?.courseOutcomeId,
      questionId: editVersionCourseInstanceTestQuestionOutcome?.questionId,
      id: editVersionCourseInstanceTestQuestionOutcome?.id,
    };

  },
  validationSchema: Yup.object().shape({}),
  handleSubmit: (values, { props, setSubmitting }) => {
    let {
      editVersionCourseInstanceTestQuestionOutcome,
      selectedFlowProgramVersion,
      dispatch,
    } = props;
    let { testId, classId } = selectedFlowProgramVersion;
    let valueUpdate = { ...values, testId, classId };
    if (editVersionCourseInstanceTestQuestionOutcome.isEdit) {
      dispatch(
        editVersionCourseInstanceTestQuestionOutcomeActionApi(valueUpdate)
      );
    } else {
      dispatch(
        postVersionCourseInstanceTestQuestionOutcomeActionApi(valueUpdate)
      );
    }
  },
})(FormVersionCourseInstanceTestQuestionOutcome);

const mapStateToProps = (state) => ({
  editVersionCourseInstanceTestQuestionOutcome:
    state.GeneralProgramReducer.editVersionCourseInstanceTestQuestionOutcome,
  selectedFlowProgramVersion:
    state.GeneralProgramReducer.selectedFlowProgramVersion,
});

export default connect(mapStateToProps)(
  FormVersionCourseInstanceTestQuestionOutcomeFormik
);
