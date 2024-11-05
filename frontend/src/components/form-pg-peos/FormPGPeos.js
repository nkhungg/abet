import React from 'react'
import { useDispatch } from "react-redux";
import { connect } from "react-redux";
import * as Yup from "yup";
import { addNewPeosActionApi, deletePeosActionApi, editPeosActionApi } from '../../actions/api-actions/ProgramAction';
import { Popconfirm } from "antd";
import { withFormik } from "formik";
const textConfirm = "Are you sure to delete this task?";

function FormPGPeos(props) {
    const dispatch = useDispatch();
  const { values, errors, handleChange, handleSubmit } = props;
  const confirmDelete = (idGeneralProgram, idProgram) => {
    dispatch(deletePeosActionApi(idGeneralProgram, idProgram))
  };
    return (
        <div>
        <form className="form-create-course" onSubmit={handleSubmit}>
        <div className="col-12">
            <div className="form-group">
              <label htmlFor="id">
                Program Id: <span className="text-danger font-weight-bold">*</span>
              </label>
              <input
                name="programId"
                value={values.programId || ""}
                onChange={handleChange}
                className="form-control"
                type="text"
                disabled={values.programId}
              />
              <span className="text-danger">{errors.programId}</span>
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
                disabled={props.editPeos.name}
              />
              <span className="text-danger">{errors.name}</span>
            </div>
          </div>
         
          <div className="col-12">
            <div className="form-group">
              <label>
                Priority: <span className="text-danger font-weight-bold">*</span>{" "}
              </label>
              <input
                name="priority"
                value={values.priority || ""}
                onChange={handleChange}
                className="form-control"
                type="number"
              />
              <span className="text-danger">{errors.priority}</span>
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
              />
              <span className="text-danger">{errors.description}</span>
            </div>
          </div>
          <div className="col-12 mt-5 d-flex justify-content-center">
            {props.editPeos.name ? (
              <Popconfirm
                placement="topLeft"
                title={textConfirm}
                onConfirm={() => confirmDelete(values.programId, values.name)}
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
    )
}

const FormPGPeosFormik = withFormik({
    enableReinitialize: true,
    mapPropsToValues: (props) => {
      const { editPeos } = props;
      console.log('values', editPeos);
  
      return {
        programId: editPeos?.programId,
        name: editPeos?.name,
        priority: editPeos?.priority,
        description: editPeos?.description,
        
      };
  
    },
    validationSchema: Yup.object().shape({
    //   id: Yup.string().required("Course code is required!"),
    //   description: Yup.string().required("Course description is required!"),
    }),
    handleSubmit: (values, { props, setSubmitting }) => {
      
      if(props.editPeos.name) {
        props.dispatch(editPeosActionApi(values))
      } else {
        props.dispatch(addNewPeosActionApi(values))
      }
    },
  })(FormPGPeos);
  
  const mapStateToProps = (state) => ({
    editPeos: state.GeneralProgramReducer.editPeos,
  });
  
  export default connect(mapStateToProps)(FormPGPeosFormik);