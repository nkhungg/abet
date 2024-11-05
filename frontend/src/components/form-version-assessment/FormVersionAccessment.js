import React from "react";
import { withFormik } from "formik";
import * as Yup from "yup";
import { connect } from "react-redux";
import {
  editCourseOutcomsInCourseInstanceActionApi,
} from "../../actions/api-actions/ProgramAction";


function FormVersionAccessment(props) {
  const { values, errors, handleChange, handleSubmit } = props;
  
  return (
    <div>
      <form className="form-create-course" onSubmit={handleSubmit}>
        <div className="col-12">
          <div className="form-group">
            <label htmlFor="courseId">
              Course outcome ID:{" "}
              <span className="text-danger font-weight-bold">*</span>
            </label>
            <input
              name="courseId"
              value={values.courseId || ""}
              onChange={handleChange}
              className="form-control"
              type="text"
              disabled
            />
          </div>
        </div>
        <div className="col-12">
          <div className="form-group">
            <label htmlFor="description">
              Description:{" "}
              <span className="text-danger font-weight-bold">*</span>
            </label>
            <input
              name="description"
              value={values.description || ""}
              onChange={handleChange}
              className="form-control"
              type="text"
              disabled
            />
          </div>
        </div>
        <div className="col-12">
          <div className="form-group">
            <label htmlFor="cdio">CDIO:</label>
            <input
              name="cdio"
              value={values.cdio || ""}
              onChange={handleChange}
              id="cdio"
              className="form-control"
              type="text"
              disabled
            />
          </div>
        </div>
        <div className="col-12">
          <div className="form-group">
            <label htmlFor="threshold">Threshold:</label>
            <input
              name="threshold"
              value={values.threshold || ""}
              onChange={handleChange}
              id="threshold"
              rows="2"
              className="form-control"
              type="number"
            />
            <span className="text-danger">{errors.threshold}</span>
          </div>
        </div>
        <div className="col-12 mt-5 d-flex justify-content-center">
          <button type="submit" className="btn btn-primary mr-2">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

const FormVersionAccessmentFormik = withFormik({
  enableReinitialize: true,
  mapPropsToValues: (props) => {
    const { editCourseAccessment } = props;
    return {
      courseId: editCourseAccessment?.courseId,
      cdio: editCourseAccessment?.cdio,
      threshold: editCourseAccessment?.threshold,
      description: editCourseAccessment?.description,
      id: editCourseAccessment?.id,
    };
  },
  validationSchema: Yup.object().shape({
    threshold: Yup.number()
      .required("Threshold is number!")
      .min(0, "Threshold must be larger than 0")
      .max(100, "Threshold must be smaller than 100"),
    //   description: Yup.string().required("Course description is required!"),
  }),
  handleSubmit: (values, { props, setSubmitting }) => {
    let { programVersionInfo } = props.selectedFlowProgramVersion;
    let valueUpdate = { ...values, programVersionInfo };
    props.dispatch(editCourseOutcomsInCourseInstanceActionApi(valueUpdate));
  },
})(FormVersionAccessment);

const mapStateToProps = (state) => ({
  editCourseAccessment: state.GeneralProgramReducer.editCourseAccessment,
  selectedFlowProgramVersion:
    state.GeneralProgramReducer.selectedFlowProgramVersion,
});

export default connect(mapStateToProps)(FormVersionAccessmentFormik);
