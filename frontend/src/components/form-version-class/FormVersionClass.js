import React, { useEffect } from "react";
import { withFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "react-redux";
import { postClassesFromCourseInstanceActionApi, editClassesFromCourseInstanceActionApi, deleteClassesFromCourseInstanceActionApi, getLecturerListActionApi } from "../../actions/api-actions/ProgramAction";
import { Popconfirm } from "antd";
import { Select } from 'antd';

const { Option } = Select;
const textConfirm = "Are you sure to delete this task?";

function FormVersionClass(props) {
  const dispatch = useDispatch();
  const { values, handleChange, handleSubmit, setFieldValue } = props;

  const {
    selectedFlowProgramVersion,
    lecturersFromCourseOutline,
  } = useSelector((state) => state.GeneralProgramReducer);

  const { programVersionInfo, courseId } = selectedFlowProgramVersion;

  useEffect(() => {
    dispatch(getLecturerListActionApi(1, 1000));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const confirmDelete = (values) => {
    let valueUpdate = {...values, programVersionInfo, courseId}
    dispatch(deleteClassesFromCourseInstanceActionApi(valueUpdate))
  };

  const renderLecturers = () => {
    return lecturersFromCourseOutline?.data?.map((lecturer, idx) => {
      return (
        <Option title={lecturer.name} value={lecturer.id} key={`${lecturer.id} - ${lecturer.name}`}>
          {lecturer.id} - {lecturer.name}
        </Option>
      );
    });
  };
  
  const onChangeSelectLecturers = (e) => {
    setFieldValue('lecturerId', e)
  }

  return (
    <div>
      <form className="form-create-course" onSubmit={handleSubmit}>
        <div className="col-12">
          <div className="form-group">
            <label htmlFor="name">
            Class Name:{" "}
              <span className="text-danger font-weight-bold">*</span>
            </label>
            <input
              name="name"
              value={values.name || ""}
              onChange={handleChange}
              className="form-control"
              type="text"
              disabled={props.editClassFromCourseInstance?.edit}
            />
          </div>
        </div>
        <div className="col-12">
          <div className="form-group">
            <label htmlFor="description">
            Lecturer: {" "}
              <span className="text-danger font-weight-bold">*</span>
            </label>
            <Select
              size="default"
              placeholder="Please select"
              value={values.lecturerId || ''}
              onChange={(e) => onChangeSelectLecturers(e)}
              style={{ width: "100%" }}
              className="general-select-ant mb-4"
              filterOption={(keyword, option) =>
                option.children
                  .toString()
                  .toLowerCase()
                  .includes(keyword.toLowerCase())
              }
            >
              {renderLecturers()}
            </Select>
          </div>
        </div>
       
        <div className="col-12 mt-5 d-flex justify-content-center">
        {props.editClassFromCourseInstance.isEdit ? (
            <Popconfirm
              placement="topLeft"
              title={textConfirm}
              onConfirm={() =>
                confirmDelete(values)
              }
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

const FormVersionClassFormik = withFormik({
  enableReinitialize: true,
  mapPropsToValues: (props) => {
    const { editClassFromCourseInstance } = props;
    return {
      name: editClassFromCourseInstance?.name,
      lecturerId: editClassFromCourseInstance?.lecturerId,
      id: editClassFromCourseInstance?.id,
    };
  },
  validationSchema: Yup.object().shape({
    
  }),
  handleSubmit: (values, { props, setSubmitting }) => {
    let { editClassFromCourseInstance, selectedFlowProgramVersion, dispatch } = props
    let { programVersionInfo, courseId } = selectedFlowProgramVersion;
    let valueUpdate = { ...values, programVersionInfo, courseId };
    if(editClassFromCourseInstance.isEdit) {
      dispatch(editClassesFromCourseInstanceActionApi(valueUpdate))
    } else {
      dispatch(postClassesFromCourseInstanceActionApi(valueUpdate))
    }
    
  },
})(FormVersionClass);

const mapStateToProps = (state) => ({
  editClassFromCourseInstance:
    state.GeneralProgramReducer.editClassFromCourseInstance,
  selectedFlowProgramVersion:
    state.GeneralProgramReducer.selectedFlowProgramVersion,
});

export default connect(mapStateToProps)(FormVersionClassFormik);
