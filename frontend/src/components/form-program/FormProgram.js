import React from "react";
import { withFormik } from "formik";
import { Popconfirm } from "antd";
import { useDispatch } from "react-redux";
import { connect } from "react-redux";
import * as Yup from "yup";
import { addNewProgramActionApi, deleteProgramActionApi, editProgramActionApi} from "../../actions/api-actions/ProgramAction";
const textConfirm = "Are you sure to delete this task?";

function FormProgram(props) {
  const dispatch = useDispatch();
  const { values, errors, handleChange, handleSubmit } = props;

  const confirmDelete = (idGeneralProgram, idProgram) => {
    dispatch(deleteProgramActionApi(idGeneralProgram, idProgram))
  };
  return (
    <div>
      <form className="form-create-course" onSubmit={handleSubmit}>
      <div className="col-12">
          <div className="form-group">
            <label htmlFor="id">
              General program Id: <span className="text-danger font-weight-bold">*</span>
            </label>
            <input
              name="idGeneralProgram"
              value={values.idGeneralProgram || ""}
              onChange={handleChange}
              className="form-control"
              type="text"
              disabled={values.idGeneralProgram}
            />
            <span className="text-danger">{errors.idGeneralProgram}</span>
          </div>
        </div>
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
              disabled={props.editProgram.id}
            />
            <span className="text-danger">{errors.id}</span>
          </div>
        </div>
        <div className="col-12">
          <div className="form-group">
            <label>
              Start year: <span className="text-danger font-weight-bold">*</span>{" "}
            </label>
            <input
              name="start"
              value={values.start || ""}
              onChange={handleChange}
              className="form-control"
              type="number"
            />
            <span className="text-danger">{errors.start}</span>
          </div>
        </div>
        <div className="col-12">
          <div className="form-group">
            <label>
              End year: <span className="text-danger font-weight-bold">*</span>{" "}
            </label>
            <input
              name="end"
              value={values.end || ""}
              onChange={handleChange}
              className="form-control"
              type="number"
            />
            <span className="text-danger">{errors.end}</span>
          </div>
        </div>
        <div className="col-12">
          <div className="form-group">
            <label>
              Apply to: <span className="text-danger font-weight-bold">*</span>{" "}
            </label>
            <input
              name="apply"
              value={values.apply || ""}
              onChange={handleChange}
              className="form-control"
              type="number"
            />
            <span className="text-danger">{errors.apply}</span>
          </div>
        </div>
        <div className="col-12">
          <div className="form-group">
            <label htmlFor="group">
              Major: 
            </label>
            <input
              name="major"
              value={values.major || ""}
              onChange={handleChange}
              id="major"
              className="form-control"
              type="text"
              disabled={values.major}
            />
            <span className="text-danger">{errors.major}</span>
          </div>
        </div>
        <div className="col-12">
          <div className="form-group">
            <label htmlFor="desc">
              Description:
            </label>
            <textarea
              name="description"
              value={values.description || ""}
              onChange={handleChange}
              id="desc"
              rows="2"
              className="text-area form-control"
              type="text"
              disabled={values.description}
            />
            <span className="text-danger">{errors.description}</span>
          </div>
        </div>
        <div className="col-12 mt-5 d-flex justify-content-center">
          {props.editProgram.id ? (
            <Popconfirm
              placement="topLeft"
              title={textConfirm}
              onConfirm={() => confirmDelete(values.idGeneralProgram, values.id)}
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

const FormProgramFormik = withFormik({
  enableReinitialize: true,
  mapPropsToValues: (props) => {
    const { editProgram } = props;

    return {
      idGeneralProgram: editProgram?.idGeneralProgram,
      id: editProgram?.id,
      major: editProgram?.major,
      description: editProgram?.description,
      start: editProgram?.start,
      end: editProgram?.end,
      apply: editProgram?.apply,
    };

  },
  validationSchema: Yup.object().shape({
    id: Yup.string().required("Course code is required!"),
    description: Yup.string().required("Course description is required!"),
  }),
  handleSubmit: (values, { props, setSubmitting }) => {
    if(props.editProgram.id) {
        props.dispatch(editProgramActionApi(values))
    } else {
        props.dispatch(addNewProgramActionApi(values))
    }
  },
})(FormProgram);

const mapStateToProps = (state) => ({
    editProgram: state.GeneralProgramReducer.editProgram,
});

export default connect(mapStateToProps)(FormProgramFormik);
