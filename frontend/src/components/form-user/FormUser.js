import React from "react";
import { withFormik } from "formik";
import { Popconfirm } from "antd";
import { useDispatch } from "react-redux";
import { connect } from "react-redux";
import * as Yup from "yup";
import {
  deleteUserActionApi,
  editUserActionApi,
  postUserActionApi,
} from "../../actions/api-actions/ProgramAction";
const textConfirm = "Are you sure to delete this task?";

function FormUser(props) {
  const dispatch = useDispatch();
  const { values, errors, handleChange, handleSubmit } = props;

  const confirmDelete = (values) => {
    dispatch(deleteUserActionApi(values));
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
            disabled={props.editUser.isEdit}
            />
        </div>
    
        </div>
        <div className="col-12">
          <div className="form-group">
            <label htmlFor="name">
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
            <label>
              Year: <span className="text-danger font-weight-bold">*</span>{" "}
            </label>
            <input
              name="year"
              value={values.year || ""}
              onChange={handleChange}
              className="form-control"
              type="number"
            />
            <span className="text-danger">{errors.year}</span>
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
            <label htmlFor="email">Email:</label>
            <input
              name="email"
              value={values.email || ""}
              onChange={handleChange}
              id="email"
              rows="2"
              className="text-area form-control"
              type="email"
            />
            <span className="text-danger">{errors.email}</span>
          </div>
        </div>
        <div className="col-12 mt-5 d-flex justify-content-center">
          {props.editUser.isEdit ? (
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

const FormUserFormik = withFormik({
  enableReinitialize: true,
  mapPropsToValues: (props) => {
    let { editUser } = props;

    return {
      id: editUser?.id,
      major: editUser?.major,
      email: editUser?.email,
      year: editUser?.year,
      name: editUser?.name,
    };
  },
  validationSchema: Yup.object().shape({}),
  handleSubmit: (values, { props, setSubmitting }) => {
    const { editUser, dispatch } = props;
    if (editUser.isEdit) {
      dispatch(editUserActionApi(values));
    } else {
      dispatch(postUserActionApi(values));
    }
  },
})(FormUser);

const mapStateToProps = (state) => ({
  editUser: state.GeneralProgramReducer.editUser,
});

export default connect(mapStateToProps)(FormUserFormik);