import React from "react";
import { withFormik } from "formik";
import * as Yup from "yup";
import { connect } from "react-redux";
import { editVersionClassAssessmentActionApi } from "../../actions/api-actions/ProgramAction";


function FormVersionClassAssessment(props) {

  const { values, errors, handleChange, handleSubmit } = props;
   
    return (
        <div>
      <form className="form-create-course" onSubmit={handleSubmit}>
        <div className="col-12">
          <div className="form-group">
            <label htmlFor="courseOutcomeInstanceId">
              Course outcome ID:{" "}
              <span className="text-danger font-weight-bold">*</span>
            </label>
            <input
              name="courseOutcomeInstanceId"
              value={values.courseOutcomeInstanceId || ""}
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
            <label htmlFor="classThreshold">ClassThreshold:</label>
            <input
              name="classThreshold"
              value={values.classThreshold || ""}
              onChange={handleChange}
              id="classThreshold"
              rows="2"
              className="form-control"
              type="number"
            />
            <span className="text-danger">{errors.classThreshold}</span>
          </div>
        </div>
        <div className="col-12 mt-5 d-flex justify-content-center">
          <button type="submit" className="btn btn-primary mr-2">
            Submit
          </button>
        </div>
      </form>
    </div>
    )
}


const FormVersionClassAssessmentFormik = withFormik({
    enableReinitialize: true,
    mapPropsToValues: (props) => {
      const { editVersionClassAssessment } = props;
      return {
        courseOutcomeInstanceId: editVersionClassAssessment?.courseOutcomeInstanceId,
        cdio: editVersionClassAssessment?.cdio,
        classThreshold: editVersionClassAssessment?.classThreshold,
        description: editVersionClassAssessment?.description,
        classId: editVersionClassAssessment?.classId,
      };
    },
    validationSchema: Yup.object().shape({
        classThreshold: Yup.number()
        .required("Threshold is number!")
        .min(0, "Threshold must be larger than 0")
        .max(100, "Threshold must be smaller than 100"),
      //   description: Yup.string().required("Course description is required!"),
    }),
    handleSubmit: (values, { props, setSubmitting }) => {
      props.dispatch(editVersionClassAssessmentActionApi(values));
    },
  })(FormVersionClassAssessment);
  
  const mapStateToProps = (state) => ({
    editVersionClassAssessment: state.GeneralProgramReducer.editVersionClassAssessment,
  });
  
  export default connect(mapStateToProps)(FormVersionClassAssessmentFormik);
  