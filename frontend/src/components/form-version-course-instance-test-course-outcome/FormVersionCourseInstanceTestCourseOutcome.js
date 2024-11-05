import React, { useEffect } from "react";
import { withFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "react-redux";
import { deleteVersionCourseInstanceTestOutcomeActionApi, editVersionCourseInstanceTestOutcomeActionApi, getCourseOutcomesInCourseInstanceActionApi, postVersionCourseInstanceTestOutcomeActionApi } from "../../actions/api-actions/ProgramAction";
import { Popconfirm } from "antd";
import { Select } from 'antd';

const { Option } = Select;
const textConfirm = "Are you sure to delete this task?";

function FormVersionCourseInstanceTestCourseOutcome(props) {
    const dispatch = useDispatch();
  const { values, handleChange, handleSubmit, setFieldValue } = props;

  const {
    selectedFlowProgramVersion,
    courseOutcomesFromCourseInstance,
  } = useSelector((state) => state.GeneralProgramReducer);

  const { programVersionInfo, courseId, testId } = selectedFlowProgramVersion;

  useEffect(() => {
    dispatch(getCourseOutcomesInCourseInstanceActionApi(programVersionInfo, courseId, 1, 3000));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const confirmDelete = (values) => {
    let valueUpdate = {...values, testId }
    dispatch(deleteVersionCourseInstanceTestOutcomeActionApi(valueUpdate))
  };

  const renderCourseOutcomeIds = () => {
    return courseOutcomesFromCourseInstance?.data?.map((item, idx) => {
      return (
        <Option value={item.id} key={`${item.id}`}>
            {item.name} - {item.description}
        </Option>
      );
    });
  };
  
  const onChangeSelectLecturers = (e) => {
    setFieldValue('courseOutcomeId', e)
  }

  return (
    <div>
      <form className="form-create-course" onSubmit={handleSubmit}>
        <div className="col-12">
          <div className="form-group">
            <label htmlFor="description">
            Lecturer: {" "}
              <span className="text-danger font-weight-bold">*</span>
            </label>
            <Select
              size="default"
              placeholder="Please select"
              value={values.courseOutcomeId || ''}
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
              {renderCourseOutcomeIds()}
            </Select>
          </div>
        </div>

        <div className="col-12">
          <div className="form-group">
            <label htmlFor="percent">
            Percent:{" "}
              <span className="text-danger font-weight-bold">*</span>
            </label>
            <input
              name="percent"
              value={values.percent || ""}
              onChange={handleChange}
              className="form-control"
              type="text"
            />
          </div>
        </div>

        <div className="col-12">
          <div className="form-group">
            <label htmlFor="comment">
            Comment:{" "}
              <span className="text-danger font-weight-bold">*</span>
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
        {props.editVersionCourseInstanceTestCourseOutcome.isEdit ? (
            <Popconfirm
              placement="topLeft"
              title={textConfirm}
              onConfirm={() =>
                confirmDelete(values)
              }
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

const FormVersionCourseInstanceTestCourseOutcomeFormik = withFormik({
    enableReinitialize: true,
    mapPropsToValues: (props) => {
      const { editVersionCourseInstanceTestCourseOutcome } = props;
      return {
        percent: editVersionCourseInstanceTestCourseOutcome?.percent,
        courseOutcomeId: editVersionCourseInstanceTestCourseOutcome?.courseOutcomeId,
        comment: editVersionCourseInstanceTestCourseOutcome?.comment,
        id: editVersionCourseInstanceTestCourseOutcome?.id,
      };
    },
    validationSchema: Yup.object().shape({
      
    }),
    handleSubmit: (values, { props, setSubmitting }) => {
      let { editVersionCourseInstanceTestCourseOutcome, selectedFlowProgramVersion, dispatch } = props
      let { testId } = selectedFlowProgramVersion;
      let valueUpdate = { ...values, testId };
      if(editVersionCourseInstanceTestCourseOutcome.isEdit) {
        dispatch(editVersionCourseInstanceTestOutcomeActionApi(valueUpdate))
      } else {
        dispatch(postVersionCourseInstanceTestOutcomeActionApi(valueUpdate))
      }
    },
  })(FormVersionCourseInstanceTestCourseOutcome);
  
  const mapStateToProps = (state) => ({
    editVersionCourseInstanceTestCourseOutcome:
      state.GeneralProgramReducer.editVersionCourseInstanceTestCourseOutcome,
    selectedFlowProgramVersion:
      state.GeneralProgramReducer.selectedFlowProgramVersion,
  });
  
  export default connect(mapStateToProps)(FormVersionCourseInstanceTestCourseOutcomeFormik);
