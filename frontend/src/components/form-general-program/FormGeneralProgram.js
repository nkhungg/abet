import React from "react";
import { withFormik } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import { Popconfirm } from "antd";
import { connect } from "react-redux";
import {
  addNewGeneralProgramActionApi,
  editGeneralProgramActionApi,
  deleteGeneralProgramActionApi,
} from "../../actions/api-actions/ProgramAction";

const textConfirm = "Are you sure to delete this task?";

function FormGeneralProgram(props) {
  const dispatch = useDispatch();
  const { values, errors, handleChange, handleSubmit } = props;

  const confirmDelete = (idGeneralProgram) => {
    console.log("id general", idGeneralProgram);
    dispatch(deleteGeneralProgramActionApi(idGeneralProgram));
  };
  return (
    <div>
      <form className="form-create-course" onSubmit={handleSubmit}>
        <div className="col-12">
          <div className="form-group">
            <label htmlFor="id">
              ID: <span className="text-danger font-weight-bold">*</span>
            </label>
            <input
              name="id"
              value={values.id || ""}
              onChange={handleChange}
              className="form-control"
              type="text"
              disabled={props.editGeneralProgram.id}
            />
            <span className="text-danger">{errors.id}</span>
          </div>
        </div>
        <div className="col-12">
          <div className="form-group">
            <label htmlFor="id">
              Name: <span className="text-danger font-weight-bold">*</span>
            </label>
            <input
              name="name"
              value={values.name || ""}
              onChange={handleChange}
              className="form-control"
              type="text"
            />
            <span className="text-danger">{errors.name}</span>
          </div>
        </div>
        <div className="col-12">
          <div className="form-group">
            <label htmlFor="group">Major:</label>
            <input
              name="major"
              value={values.major || ""}
              onChange={handleChange}
              id="major"
              className="form-control"
              type="text"
            />
            <span className="text-danger">{errors.major}</span>
          </div>
        </div>
        <div className="col-12">
          <div className="form-group">
            <label htmlFor="desc">Description:</label>
            <textarea
              name="description"
              value={values.description || ""}
              onChange={handleChange}
              id="desc"
              rows="2"
              className="text-area form-control"
              type="text"
            />
            <span className="text-danger">{errors.description}</span>
          </div>
        </div>
        <div className="col-12 mt-5 d-flex justify-content-center">
          {props.editGeneralProgram.id ? (
            <Popconfirm
              placement="topLeft"
              title={textConfirm}
              onConfirm={() => confirmDelete(values.id)}
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

const FormGeneralProgramFormik = withFormik({
  enableReinitialize: true,
  mapPropsToValues: (props) => {
    const { editGeneralProgram } = props;
    return {
      id: editGeneralProgram?.id,
      name: editGeneralProgram?.name,
      major: editGeneralProgram?.major,
      description: editGeneralProgram?.description,
    };
  },
  validationSchema: Yup.object().shape({
    id: Yup.string().required("Course code is required!"),
    //   description: Yup.string().required("Course description is required!"),
  }),
  handleSubmit: (values, { props, setSubmitting }) => {
    if (props.editGeneralProgram.id) {
      props.dispatch(editGeneralProgramActionApi(values));
    } else {
      props.dispatch(addNewGeneralProgramActionApi(values));
    }
  },
})(FormGeneralProgram);

const mapStateToProps = (state) => ({
  editGeneralProgram: state.GeneralProgramReducer.editGeneralProgram,
});

export default connect(mapStateToProps)(FormGeneralProgramFormik);
