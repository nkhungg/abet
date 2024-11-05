import React from "react";
import { Popconfirm } from "antd";
import { connect } from "react-redux";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { withFormik } from "formik";
import { addNewSemesterGroupActionApi, deleteSemesterGroupActionApi, editSemesterGroupActionApi } from "../../actions/api-actions/ProgramAction";

const textConfirm = "Are you sure to delete this task?";

function FormCurriculum(props) {
  const dispatch = useDispatch();
  const { values, errors, handleChange, handleSubmit } = props;

  const confirmDelete = (id) => {
    let {programId} = props.selectedFolw
    let {isSemester} = props
    dispatch(deleteSemesterGroupActionApi(programId, id, isSemester ? true : false));
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
              value={props.isSemester ? props.editCirSemester.programId : props.editCirGroup.programId || ""}
              onChange={handleChange}
              className="form-control"
              type="text"
              disabled={props.selectedFolw.programId}
            />
            <span className="text-danger">{errors.programId}</span>
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
              disabled={props.isSemester ? props.editCirSemester.id : props.editCirGroup.id}
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
        <div className="col-12 mt-5 d-flex justify-content-center">
          {(props.isSemester && props.editCirSemester.id) || (!props.isSemester && props.editCirGroup.id)  ? (
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

const FormCurriculumFormik = withFormik({
  enableReinitialize: true,
  mapPropsToValues: (props) => {
    const { editCirSemester, editCirGroup, isSemester, selectedFolw } = props;
    
    return {
      id: (isSemester ? editCirSemester : editCirGroup)?.id,
      name: (isSemester ? editCirSemester : editCirGroup)?.name,
      programId: selectedFolw.programId,
    };
  },
  validationSchema: Yup.object().shape({
    id: Yup.string().required("Course code is required!"),
    //   description: Yup.string().required("Course description is required!"),
  }),
  handleSubmit: (values, { props, setSubmitting }) => {
    const { editCirSemester, editCirGroup, isSemester, selectedFolw } = props;

    let data = {...values, programId: selectedFolw.programId}

    if(isSemester) {
        if(editCirSemester.id) {
            props.dispatch(editSemesterGroupActionApi(data, true))
        } else {
            props.dispatch(addNewSemesterGroupActionApi(data, true))
        }
    } else {
        if(editCirGroup.id) {
            props.dispatch(editSemesterGroupActionApi(data, false))
        } else {
            props.dispatch(addNewSemesterGroupActionApi(data, false))
        }
    }
    
  },
})(FormCurriculum);

const mapStateToProps = (state) => ({
  editCirSemester: state.GeneralProgramReducer.editCirSemester,
  editCirGroup: state.GeneralProgramReducer.editCirGroup,
  isSemester: state.GeneralProgramReducer.isSemester,
  selectedFolw: state.GeneralProgramReducer.selectedFolw,
});

export default connect(mapStateToProps)(FormCurriculumFormik);
