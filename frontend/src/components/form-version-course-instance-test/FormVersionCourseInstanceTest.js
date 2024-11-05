import React from "react";
import { Popconfirm } from "antd";
import { connect } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { withFormik } from "formik";
import {
    deleteVersionCourseInstanceTestActionApi,
    editVersionCourseInstanceTestActionApi,
    postVersionCourseInstanceTestActionApi,
} from "../../actions/api-actions/ProgramAction";

const textConfirm = "Are you sure to delete this task?";


function FormVersionCourseInstanceTest(props) {
    const dispatch = useDispatch();
  const { values, handleChange, handleSubmit, errors } = props;
  const {
    selectedFlowProgramVersion,
  } = useSelector((state) => state.GeneralProgramReducer);

  const {
    programVersionInfo,
    courseId,
  } = selectedFlowProgramVersion;

  const confirmDelete = (values) => {
    let valueUpdate = {...values, programVersionInfo, courseId}
    dispatch(deleteVersionCourseInstanceTestActionApi(valueUpdate));
  };

  return (
    <div>
      <form className="form-cirr-course" onSubmit={handleSubmit}>
       
       
        <div className="col-12">
          <div className="form-group">
            <label htmlFor="name">Test name: </label>
            <input
              name="name"
              value={values.name || ""}
              onChange={handleChange}
              className="form-control"
              type="text"
            />
          </div>
        </div>
        <div className="col-12">
          <div className="form-group">
            <label htmlFor="percent">Percent: </label>
            <input
              name="percent"
              value={values.percent || ""}
              onChange={handleChange}
              className="form-control"
              type="number"
            />
            <span className="text-danger">{errors.percent}</span>
          </div>
        </div>

        <div className="col-12 mt-5 d-flex justify-content-center">
          {props.editVersionCourseInstanceTest.isEdit && (
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
          )}
          <button type="submit" className="btn btn-primary mr-2">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

const FormVersionCourseInstanceTestFormik = withFormik({
    enableReinitialize: true,
    mapPropsToValues: (props) => {
      const {
        editVersionCourseInstanceTest,
      } = props;
      return {
        id: editVersionCourseInstanceTest?.id,
        name: editVersionCourseInstanceTest?.name,
        percent: editVersionCourseInstanceTest?.percent,
      };
    },
    validationSchema: Yup.object().shape({
        percent: Yup.number().required().min(0, 'Percent must be larger than 0!').max(100, 'Percent must be smaller than 100!'),
    }),
    handleSubmit: (values, { props, setSubmitting }) => {
      const {
        editVersionCourseInstanceTest,
        selectedFlowProgramVersion,
      } = props;
      const { programVersionInfo, courseId } = selectedFlowProgramVersion;
      let valueUpdate = { ...values, programVersionInfo, courseId };
   
      if (editVersionCourseInstanceTest.isEdit) {
        props.dispatch(editVersionCourseInstanceTestActionApi(valueUpdate));
      } else {
        props.dispatch(postVersionCourseInstanceTestActionApi(valueUpdate));
      }
    },
  })(FormVersionCourseInstanceTest);
  
  const mapStateToProps = (state) => ({
    editVersionCourseInstanceTest:
      state.GeneralProgramReducer.editVersionCourseInstanceTest,
    selectedFlowProgramVersion:
      state.GeneralProgramReducer.selectedFlowProgramVersion,
  });
  
  export default connect(mapStateToProps)(FormVersionCourseInstanceTestFormik);