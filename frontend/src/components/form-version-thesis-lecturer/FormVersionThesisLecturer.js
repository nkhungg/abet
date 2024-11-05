import React, { useEffect } from "react";
import { withFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "react-redux";
import {
    deleteVersionThesisLecturerActionApi,
  editVersionThesisLecturerActionApi,
  getLecturerListActionApi,
  postVersionThesisLecturerActionApi,
} from "../../actions/api-actions/ProgramAction";
import { Popconfirm } from "antd";
import { Select } from "antd";

const { Option } = Select;
const textConfirm = "Are you sure to delete this task?";

function FormVersionThesisLecturer(props) {
  const dispatch = useDispatch();
  const { values, handleSubmit, setFieldValue } = props;

  const {
    selectedFlowProgramVersion,
    lecturersFromCourseOutline,
  } = useSelector((state) => state.GeneralProgramReducer);

  const { programVersionInfo } = selectedFlowProgramVersion;

  useEffect(() => {
    dispatch(getLecturerListActionApi(1, 1000));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const confirmDelete = (values) => {
    let valueUpdate = { ...values, programVersionInfo };
    dispatch(deleteVersionThesisLecturerActionApi(valueUpdate));
  };

  const renderLecturers = () => {
    return lecturersFromCourseOutline?.data?.map((item, idx) => {
      return (
        <Option value={item.id} key={`${item.id}-${idx}`}>
          {item.id} - {item.name}
        </Option>
      );
    });
  };

  const onChangeSelectLecturers = (e) => {
    setFieldValue("lecturerId", e);
  };

  const onChangeRole = (e) => {
    setFieldValue("role", e);
  }

  return (
    <div>
      <form className="form-create-course" onSubmit={handleSubmit}>

        <div className="col-12">
          <div className="form-group">
            <label htmlFor="lecturerId">
              Lecturer: <span className="text-danger font-weight-bold">*</span>
            </label>
            <Select
              size="default"
              placeholder="Please select"
              value={values.lecturerId || ""}
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

        <div className="col-12">
          <div className="form-group">
            <label htmlFor="role">
              Role: <span className="text-danger font-weight-bold">*</span>
            </label>
            <Select
              size="default"
              placeholder="Please select role"
              value={values.role || ""}
              onChange={(e) => onChangeRole(e)}
              style={{ width: "100%" }}
              className="general-select-ant mb-4"
            >
              <Option key="Primary supervisor">Primary supervisor</Option>
              <Option key="Secondary supervisor">Secondary supervisor</Option>
              <Option key="Reviewer mid term">Reviewer mid term</Option>
              <Option key="Reviewer final term">Reviewer final term</Option>
            </Select>
          </div>
        </div>


        <div className="col-12 mt-5 d-flex justify-content-center">
          {props.editVersionThesisLecturer.isEdit ? (
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

const FormVersionThesisLecturerFormik = withFormik({
  enableReinitialize: true,
  mapPropsToValues: (props) => {
    const { editVersionThesisLecturer } = props;
    return {
      id: editVersionThesisLecturer?.id,
      projectId: editVersionThesisLecturer?.projectId,
      lecturerId: editVersionThesisLecturer?.lecturerId,
      role: editVersionThesisLecturer?.role,
    };
  },
  validationSchema: Yup.object().shape({}),
  handleSubmit: (values, { props, setSubmitting }) => {
    let {
      editVersionThesisLecturer,
      selectedFlowProgramVersion,
      dispatch,
    } = props;
    let { programVersionInfo } = selectedFlowProgramVersion;
    let valueUpdate = { ...values, programVersionInfo };
    if (editVersionThesisLecturer.isEdit) {
      dispatch(editVersionThesisLecturerActionApi(valueUpdate));
    } else {
      dispatch(postVersionThesisLecturerActionApi(valueUpdate));
    }
  },
})(FormVersionThesisLecturer);

const mapStateToProps = (state) => ({
  editVersionThesisLecturer:
    state.GeneralProgramReducer.editVersionThesisLecturer,
  selectedFlowProgramVersion:
    state.GeneralProgramReducer.selectedFlowProgramVersion,
});

export default connect(mapStateToProps)(FormVersionThesisLecturerFormik);
