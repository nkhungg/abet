import React, { useEffect } from "react";
import { withFormik } from "formik";
import { Popconfirm } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { connect } from "react-redux";
import * as Yup from "yup";
import {
  deleteCourseInstanceProgramVersionActionApi,
  editCourseInstanceProgramVersionActionApi,
  getCourseInstanceCourseIdsActionApi,
  getProgramInfoListActionApi,
  postNewCourseInstanceProgramVersionActionApi,
} from "../../actions/api-actions/ProgramAction";
import { Select } from 'antd';

const textConfirm = "Are you sure to delete this task?";
const { Option } = Select;


function FormDirectCourseInstance(props) {
    const dispatch = useDispatch();
  const { values, handleChange, handleSubmit, setFieldValue } = props;
  const { courseInstanceIds, programInfo } = useSelector((state) => state.GeneralProgramReducer);

  useEffect(() => {
    dispatch(getProgramInfoListActionApi())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const confirmDelete = (values) => {
      let {programVersionInfo} = values
    dispatch(deleteCourseInstanceProgramVersionActionApi(programVersionInfo, values));
  };

  const handleChangeCheckboxOutline = (e) => {
    setFieldValue("outlineChecked", e.target.checked);
  };

  const handleChangeCheckboxOutcome = (e) => {
    setFieldValue("outcomeChecked", e.target.checked);
  };

  const getProgramVersionInfoValue = (value) => {
    setFieldValue('programVersionInfo', value)
    let programVersionId = value.split('-')[0]
    dispatch(getCourseInstanceCourseIdsActionApi(programVersionId))
  }

  const renderOptionsCourseInstanceIds = () => {
    return courseInstanceIds?.map((item, idx) => {
      return <Option key={idx} value={`${item.id}-${item.name}-${item.credit}`}>{item.id} - {item.name}</Option>
    })
  }
  const renderOptionsProgramInfos = () => {
    return programInfo?.map((item, idx) => {
      return <Option value={item} key={idx}>{item}</Option>
    })
  }

  const getCourseIdValue = (value) => {
    let valueInfo = value.split('-')
    if(valueInfo.length) {
      setFieldValue('courseId', valueInfo[0])
      setFieldValue('name', valueInfo[1])
      setFieldValue('credit', valueInfo[2])
    }
  }

  return (
    <div>
      <form className="form-create-course" onSubmit={handleSubmit}>
        <div className="col-12">
          <div className="form-group">
            <label htmlFor="programId">
              Program Version Info:{" "}
              <span className="text-danger font-weight-bold">*</span>
            </label>
            {props.editDirectCourseInstance.isEdit && 
            <input
              name="programVersionInfo"
              value={values.programVersionInfo || ""}
              onChange={handleChange}
              className="form-control"
              type="text"
              disabled
            />}
            {!props.editDirectCourseInstance.isEdit && 
              <Select
                className='w-full'
                showSearch
                style={{ width: '100%', height: '32px' }}
                placeholder="Search to Select"
                optionFilterProp="children"
                onChange={getProgramVersionInfoValue}
                filterOption={(input, option) =>
                  option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              > 
                {renderOptionsProgramInfos()}
            </Select>}
          </div>
        </div>
        <div className="col-12">
          <div className="form-group">
            <label>
              Course ID: 
            </label><br />
            {props.editDirectCourseInstance.isEdit && 
            <input
              name="courseId"
              value={values.courseId || ""}
              onChange={handleChange}
              className="form-control"
              type="text"
              disabled
            />}
            {!props.editDirectCourseInstance.isEdit && 
              <Select
                className='w-full'
                showSearch
                style={{ width: '100%', height: '32px' }}
                placeholder="Search to Select"
                optionFilterProp="children"
                onChange={getCourseIdValue}
                filterOption={(input, option) =>
                  option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              > 
                {renderOptionsCourseInstanceIds()}
            </Select>}
          </div>
        </div>
        <div className="col-12">
          <div className="form-group">
            <label>
              Course Name:{" "}
              <span className="text-danger font-weight-bold">*</span>{" "}
            </label>
            <input
              name="name"
              value={values.name || ""}
              onChange={handleChange}
              className="form-control"
              type="text"
            />
          </div>
        </div>
        <div className="col-12">
          <div className="form-group">
            <label htmlFor="group">Credit:</label>
            <input
              name="credit"
              value={values.credit || ""}
              onChange={handleChange}
              id="credit"
              className="form-control"
              type="number"
            />
          </div>
        </div>
        {props.editDirectCourseInstance.isEdit && (
          <div className="col-12">
            <div className="form-group">
              <label htmlFor="group">Level:</label>
              <input
                name="level"
                value={values.level || ""}
                onChange={handleChange}
                id="level"
                className="form-control"
                type="text"
              />
            </div>
          </div>
        )}
        {!props.editDirectCourseInstance.isEdit && (
          <div>
            <label className="pl-3" htmlFor="desc mb-0">
              Do you want to copy data from program course? :
            </label>
            <div className="row col-12">
              <div className="col-6">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    name="outlineChecked"
                    checked={values.outlineChecked}
                    value={values.outlineChecked || 0}
                    onChange={(e) => handleChangeCheckboxOutline(e)}
                  />
                  <label className="form-check-label" htmlFor="exampleCheck1">
                    Course outline
                  </label>
                </div>
              </div>

              <div className="col-6">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    name="outcomeChecked"
                    checked={values.outcomeChecked}
                    value={values.outcomeChecked || 0}
                    onChange={(e) => handleChangeCheckboxOutcome(e)}
                  />
                  <label className="form-check-label" htmlFor="exampleCheck1">
                    Course outcome
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="col-12 mt-5 d-flex justify-content-center">
          {props.editDirectCourseInstance.isEdit ? (
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


const FormDirectCourseInstanceFormik = withFormik({
    enableReinitialize: true,
    mapPropsToValues: (props) => {
      const { editDirectCourseInstance } = props;
  
      return {
        programVersionInfo: editDirectCourseInstance?.programVersionInfo,
        programInstanceId: editDirectCourseInstance?.editDirectCourseInstance,
        programId: editDirectCourseInstance?.programId,
        courseId: editDirectCourseInstance?.courseId, 
        name: editDirectCourseInstance?.name,
        credit: editDirectCourseInstance?.credit,
        outlineChecked: false,
        outcomeChecked: false,
      };
    },
    validationSchema: Yup.object().shape({}),
    handleSubmit: (values, { props, setSubmitting }) => {
      let { editDirectCourseInstance, dispatch } = props;
      let { programId, courseId, credit, name, outlineChecked, outcomeChecked, programInstanceId, programVersionInfo } = values
      if (editDirectCourseInstance.isEdit) {    
        let params = { courseId, credit, name }    
        dispatch(
          editCourseInstanceProgramVersionActionApi(programVersionInfo, params)
        );
      } else {
        let params = { programId, courseId, credit, name, outlineChecked, outcomeChecked, programInstanceId }    
        dispatch(
          postNewCourseInstanceProgramVersionActionApi(programVersionInfo, params)
        );
      }
    },
  })(FormDirectCourseInstance);
  
  const mapStateToProps = (state) => ({
    editDirectCourseInstance: state.GeneralProgramReducer.editDirectCourseInstance,
  });
  
  export default connect(mapStateToProps)(FormDirectCourseInstanceFormik);