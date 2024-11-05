import React from "react";
import { withFormik } from "formik";
import { Popconfirm } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "react-redux";
import * as Yup from "yup";
import {
    deleteLecturerActionApi,
  editLecturerActionApi,
  postLecturerActionApi,
} from "../../actions/api-actions/ProgramAction";
import { Select } from "antd";

const textConfirm = "Are you sure to delete this task?";

const { Option } = Select;

function FormLecturer(props) {
    const dispatch = useDispatch();
  const { values, errors, handleChange, handleSubmit, setFieldValue } = props;

  const confirmDelete = (values) => {
    dispatch(deleteLecturerActionApi(values));
  };

  const { visible } = useSelector((state) => state.DrawerCourseReducer) 

  if(!visible) return null

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
            disabled={props.editLecturer.isEdit}
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
            Faculty: <span className="text-danger font-weight-bold">*</span>{" "}
            </label>
            <input
              name="faculty"
              value={values.faculty || ""}
              onChange={handleChange}
              className="form-control"
              type="text"
            />
            <span className="text-danger">{errors.faculty}</span>
          </div>
        </div>
        <div className="col-12">
          <div className="form-group">
            <label htmlFor="group">Email:</label>
            <input
              name="email"
              value={values.email || ""}
              onChange={handleChange}
              id="email"
              className="form-control"
              type="text"
            />
            <span className="text-danger">{errors.email}</span>
          </div>
        </div>
        <div className="col-12">
          <div className="form-group">
            <label htmlFor="department">Department:</label>
            <input
              name="department"
              value={values.department || ""}
              onChange={handleChange}
              id="department"
              rows="2"
              className="text-area form-control"
              type="text"
            />
            <span className="text-danger">{errors.department}</span>
          </div>
        </div>
        <div className="col-12">
          <div className="form-group">
            <label htmlFor="phoneNumber">Phone number:</label>
            <input
              name="phoneNumber"
              value={values.phoneNumber || ""}
              onChange={handleChange}
              id="phoneNumber"
              rows="2"
              className="text-area form-control"
              type="text"
            />
            <span className="text-danger">{errors.phoneNumber}</span>
          </div>
        </div>
        <div className="col-12">
          <div className="form-group">
            <label htmlFor="contactLevel">Contact Level:</label>
            <Select
              size="default"
              placeholder="Please select survey type"
              value={values.contactLevel || ""}
              onChange={(e) => setFieldValue('contactLevel', e)}
              style={{ width: "100%" }}
              className="general-select-ant mb-4"
            >
              <Option value='university level'>University level</Option>
              <Option value='faculty level'>Faculty level</Option>
            </Select>
            <span className="text-danger">{errors.contactLevel}</span>
          </div>
        </div>
        <div className="col-12 mt-5 d-flex justify-content-center">
          {props.editLecturer.isEdit ? (
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
    )
}

const FormLecturerFormik = withFormik({
    enableReinitialize: true,
    mapPropsToValues: (props) => {
      let { editLecturer } = props;
      return {
        id: editLecturer?.id,
        name: editLecturer?.name,
        email: editLecturer?.email,
        faculty: editLecturer?.faculty,
        department: editLecturer?.department,
        phoneNumber: editLecturer?.phoneNumber,
        contactLevel: editLecturer?.contactLevel,
      };
    },
    validationSchema: Yup.object().shape({}),
    handleSubmit: (values, { props, setSubmitting }) => {
      const { editLecturer, dispatch } = props;
      if (editLecturer.isEdit) {
        dispatch(editLecturerActionApi(values));
      } else {
        dispatch(postLecturerActionApi(values));
      }
    },
  })(FormLecturer);
  
  const mapStateToProps = (state) => ({
    editLecturer: state.GeneralProgramReducer.editLecturer,
  });
  
  export default connect(mapStateToProps)(FormLecturerFormik);