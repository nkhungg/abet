import React from 'react'
import { useDispatch } from "react-redux";
import { connect } from "react-redux";
import * as Yup from "yup";
import { addNewOutcomesActionApi, editOutcomesActionApi, deleteOutcomesActionApi } from '../../actions/api-actions/ProgramAction';
import { Popconfirm } from "antd";
import { withFormik } from "formik";
const textConfirm = "Are you sure to delete this task?";

function FormPGOutcomes(props) {
    const dispatch = useDispatch();
  const { values, errors, handleChange, handleSubmit } = props;
  const confirmDelete = (idProgram, outcomeName) => {
    dispatch(deleteOutcomesActionApi(idProgram, outcomeName))
    
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
                Outcome name: <span className="text-danger font-weight-bold">*</span>
              </label>
              <input
                name="outcomeName"
                value={values.outcomeName || ""}
                onChange={handleChange}
                className="form-control"
                type="text"
                disabled={props.editOutcome.outcomeName}
              />
              <span className="text-danger">{errors.outcomeName}</span>
            </div>
          </div>
         
          <div className="col-12">
            <div className="form-group">
              <label>
              Cdio: <span className="text-danger font-weight-bold">*</span>{" "}
              </label>
              <input
                name="cdio"
                value={values.cdio || ""}
                onChange={handleChange}
                className="form-control"
                type="number"
              />
              <span className="text-danger">{errors.cdio}</span>
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
                rows="4"
                className="text-area form-control"
                type="text"
              />
              <span className="text-danger">{errors.description}</span>
            </div>
          </div>
          <div className="col-12 mt-5 d-flex justify-content-center">
            {props.editOutcome.outcomeName ? (
              <Popconfirm
                placement="topLeft"
                title={textConfirm}
                onConfirm={() => confirmDelete(values.programId, values.outcomeName)}
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

const FormPGOutcomesFormik = withFormik({
    enableReinitialize: true,
    mapPropsToValues: (props) => {
      const { editOutcome } = props;
      // console.log('editOutcome', editOutcome);
  
      return {
        programId: editOutcome?.programId,
        outcomeName: editOutcome?.outcomeName,
        cdio: editOutcome?.cdio,
        description: editOutcome?.description,
      };
  
    },
    validationSchema: Yup.object().shape({
    //   id: Yup.string().required("Course code is required!"),
    //   description: Yup.string().required("Course description is required!"),
    }),
    handleSubmit: (values, { props, setSubmitting }) => {
      console.log('values', values)
      if(props.editOutcome.outcomeName) {
        props.dispatch(editOutcomesActionApi(values))
      } else {
        props.dispatch(addNewOutcomesActionApi(values))
      }
    },
  })(FormPGOutcomes);
  
  const mapStateToProps = (state) => ({
    editOutcome: state.GeneralProgramReducer.editOutcome,
  });
  
  export default connect(mapStateToProps)(FormPGOutcomesFormik);