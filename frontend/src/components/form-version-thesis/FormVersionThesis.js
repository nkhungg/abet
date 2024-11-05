import React, { useEffect } from "react";
import { withFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "react-redux";
import {
    deleteVersionThesisActionApi,
  editVersionThesisActionApi,
  getLecturerListActionApi,
  postVersionThesisActionApi,
} from "../../actions/api-actions/ProgramAction";
import { Popconfirm } from "antd";
import { Select } from "antd";

const { Option } = Select;
const textConfirm = "Are you sure to delete this task?";

function FormVersionThesis(props) {
  const dispatch = useDispatch();
  const { values, handleChange, handleSubmit, setFieldValue } = props;

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
    dispatch(deleteVersionThesisActionApi(valueUpdate))
  };

  const renderLecturers = () => {
    return lecturersFromCourseOutline?.data?.map((item, idx) => {
      return (
        <Option value={item.id} key={`${item.id}`}>
          {item.id} - {item.name} 
        </Option>
      );
    });
  };

  const onChangeSelectLecturers = (e) => {
    setFieldValue("reviewerId", e);
  };

  const handleChangeCheckbox = (e) => {
    setFieldValue('isMultiMajor', e.target.checked)
  }

  return (
    <div>
      <form className="form-create-course" onSubmit={handleSubmit}>
        <div className="col-12">
          <div className="form-group">
            <label htmlFor="projectName">
              Project name:{" "}
              <span className="text-danger font-weight-bold">*</span>
            </label>
            <input
              name="projectName"
              value={values.projectName || ""}
              onChange={handleChange}
              className="form-control"
              type="text"
            />
          </div>
        </div>

        <div className="col-12">
          <div className="form-group">
            <label htmlFor="description">
              Lecturer: <span className="text-danger font-weight-bold">*</span>
            </label>
            <Select
              size="default"
              placeholder="Please select"
              value={values.reviewerId || ""}
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
            <label htmlFor="council">
              Council: <span className="text-danger font-weight-bold">*</span>
            </label>
            <input
              name="council"
              value={values.council || ""}
              onChange={handleChange}
              className="form-control"
              type="text"
            />
          </div>
        </div>

        <div className='col-12'>
        <div className="form-check">
            <input 
              type="checkbox" 
              className="form-check-input" 
              id="isMultiMajor" 
              name="isMultiMajor"
              checked={values.isMultiMajor}
              value={values.isMultiMajor || 0}
              onChange={(e) => handleChangeCheckbox(e)}
              />
            <label className="form-check-label" htmlFor="isMultiMajor">Is multidisciplinary??</label>
        </div>
        </div>

        <div className="col-12 mt-5 d-flex justify-content-center">
          {props.editVersionThesis.isEdit ? (
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

const FormVersionThesisFormik = withFormik({
  enableReinitialize: true,
  mapPropsToValues: (props) => {
    const { editVersionThesis } = props;
    return {
      council: editVersionThesis?.council,
      projectName: editVersionThesis?.projectName,
      reviewerId: editVersionThesis?.reviewerId,
      projectId: editVersionThesis?.projectId,
      isMultiMajor: editVersionThesis?.isMultiMajor,
    };
  },
  validationSchema: Yup.object().shape({}),
  handleSubmit: (values, { props, setSubmitting }) => {
    let { editVersionThesis, selectedFlowProgramVersion, dispatch } = props;
    let { programVersionInfo } = selectedFlowProgramVersion;
    let valueUpdate = {...values, programVersionInfo}
      if(editVersionThesis.isEdit) {
        dispatch(editVersionThesisActionApi(valueUpdate))
      } else {
        dispatch(postVersionThesisActionApi(valueUpdate))
      }
  },
})(FormVersionThesis);

const mapStateToProps = (state) => ({
  editVersionThesis: state.GeneralProgramReducer.editVersionThesis,
  selectedFlowProgramVersion:
    state.GeneralProgramReducer.selectedFlowProgramVersion,
});

export default connect(mapStateToProps)(FormVersionThesisFormik);
