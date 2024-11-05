import React, { useEffect } from "react";
import { Popconfirm } from "antd";
import { connect } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { withFormik } from "formik";

import { Select } from "antd";
import { deleteCourseOutcomsInCourseInstanceActionApi, editCourseOutcomsInCourseInstanceActionApi, getIndicatorAutocompleteActionApi, getParentOutcomeAutocompleteInCourseInstanceActionApi, postCourseOutcomsInCourseInstanceActionApi } from "../../../../../../../actions/api-actions/ProgramAction";

const textConfirm = "Are you sure to delete this task?";

const { Option } = Select;


function FormCourseOutcomeInstance(props) {

    const dispatch = useDispatch();
  const { values, errors, handleChange, handleSubmit, setFieldValue } = props;
  const {
    selectedFlowProgramVersion,
    editCourseOutlineOutcomesFromCourseInstance,
    indicatorNameAutocomplete,
    parentIdAutocompleteCourseInstance,
  } = useSelector((state) => state.GeneralProgramReducer);

  const { programVersionInfo, programVersionId, courseId } = selectedFlowProgramVersion;


  useEffect(() => {
    dispatch(getIndicatorAutocompleteActionApi(programVersionId));
    dispatch(getParentOutcomeAutocompleteInCourseInstanceActionApi(programVersionInfo, courseId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [programVersionInfo]);

  const confirmDelete = (values) => {
    let valueUpdate = {...values, programVersionInfo}
    dispatch(deleteCourseOutcomsInCourseInstanceActionApi(valueUpdate));
  };

  const renderOptionIndicatorName = () => {
    return indicatorNameAutocomplete?.data?.map((item, idx) => {
      return (
        <Option key={idx} value={item}>
          {item}
        </Option>
      );
    });
  };

  const renderOptionParentId = () => {
    let {name} = editCourseOutlineOutcomesFromCourseInstance
    return parentIdAutocompleteCourseInstance?.data?.filter(item => item.name !== name).map((item, idx) => {
      return (
        <Option key={idx} value={item.id}>
          {item.name}
        </Option>
      );
    });
  };

  const getIndicatorName = (value) => {
    setFieldValue('indicatorName', value)
  };

  const getParentId = (value) => {
    setFieldValue('parentId', value)
  };

    return (
        <div>
      <form className="form-cirr-course" onSubmit={handleSubmit}>
        <div className="col-12">
          <div className="form-group">
            <label htmlFor="programId">Program Id: </label>
            <input
              name="programId"
              value={values.programId || ""}
              onChange={handleChange}
              className="form-control"
              type="text"
              disabled
            />
          </div>
        </div>
        <div className="col-12">
          <div className="form-group">
            <label htmlFor="courseId">Course Id: </label>
            <input
              name="courseId"
              value={values.courseId || ""}
              onChange={handleChange}
              className="form-control"
              type="text"
              disabled
            />
          </div>
        </div>
        <div className="col-12">
          <div className="form-group">
            <label htmlFor="name">Outcome name: </label>
            <input
              name="name"
              value={values.name || ""}
              onChange={handleChange}
              className="form-control"
              type="text"
              disabled={props.editCourseOutlineOutcomesFromCourseInstance.isEdit}
            />
          </div>
        </div>
        <div className="col-12">
          <div className="form-group">
            <label htmlFor="description">Description: </label>
            <input
              name="description"
              value={values.description || ""}
              onChange={handleChange}
              className="form-control"
              type="text"
            />
          </div>
        </div>
        <div className="col-12">
          <div className="form-group">
            <label htmlFor="cdio">CDIO: </label>
            <input
              name="cdio"
              value={values.cdio || ""}
              onChange={handleChange}
              className="form-control"
              type="text"
            />
          </div>
        </div>
        <div className="col-12">
          <div className="form-group">
            <label htmlFor="percentIndicator">Percent Indicator: </label>
            <input
              name="percentIndicator"
              value={values.percentIndicator || ""}
              onChange={handleChange}
              className="form-control"
              type="number"
            />
            <span className="text-danger">{errors.percentIndicator}</span>
          </div>
        </div>
        <div className="col-12">
          <div className="form-group">
            <label>Indicator Name:</label>
            <br />
            <Select
              showSearch
              name="indicatorName"
              value={values.indicatorName || ''}
              className="w-100"
              placeholder="Search to Select"
              optionFilterProp="children"
              onChange={getIndicatorName}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {renderOptionIndicatorName()}
            </Select>
            ,
          </div>
        </div>
        <div className="col-12">
          <div className="form-group">
            <label>Parent outcome:</label>
            <br />
            <Select
              name="parentId"
              value={values.parentId || 0}
              showSearch
              className="w-100"
              placeholder="Search to Select"
              optionFilterProp="children"
              onChange={getParentId}
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {renderOptionParentId()}
            </Select>
            ,
          </div>
        </div>

        <div className="col-12 mt-5 d-flex justify-content-center">
          {props.editCourseOutlineOutcomesFromCourseInstance.isEdit && (
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
          )}
          <button type="submit" className="btn btn-primary mr-2">
            Submit
          </button>
        </div>
      </form>
    </div>
    )
}

const FormCourseOutcomeInstanceFormik = withFormik({
    enableReinitialize: true,
    mapPropsToValues: (props) => {
      const {
        editCourseOutlineOutcomesFromCourseInstance,
          selectedFlowProgramVersion,
      } = props;
      return {
        programId: selectedFlowProgramVersion?.programVersionId,
        courseId: selectedFlowProgramVersion?.courseId,
        id: editCourseOutlineOutcomesFromCourseInstance?.id,
        name: editCourseOutlineOutcomesFromCourseInstance?.name,
        description: editCourseOutlineOutcomesFromCourseInstance?.description,
        cdio: editCourseOutlineOutcomesFromCourseInstance?.cdio,
        percentIndicator: editCourseOutlineOutcomesFromCourseInstance?.percentIndicator,
        indicatorName: editCourseOutlineOutcomesFromCourseInstance?.indicatorName,
        parentId: editCourseOutlineOutcomesFromCourseInstance?.parentId,
        isEdit: editCourseOutlineOutcomesFromCourseInstance?.isEdit,
        programInstanceId: selectedFlowProgramVersion?.programInstanceId,
      };
    },
    validationSchema: Yup.object().shape({
      percentIndicator: Yup.number().min(0).max(100),
    }),
    handleSubmit: (values, { props, setSubmitting }) => {
        const {
            editCourseOutlineOutcomesFromCourseInstance,
            selectedFlowProgramVersion,
          } = props;
          const { programVersionInfo } = selectedFlowProgramVersion;
          let valueUpdate = { ...values, programVersionInfo };
       
          if (editCourseOutlineOutcomesFromCourseInstance.isEdit) {
            props.dispatch(editCourseOutcomsInCourseInstanceActionApi(valueUpdate));
          } else {
            props.dispatch(postCourseOutcomsInCourseInstanceActionApi(valueUpdate));
          }
    },
  })(FormCourseOutcomeInstance);
  
  const mapStateToProps = (state) => ({
    editCourseOutlineOutcomesFromCourseInstance:
      state.GeneralProgramReducer.editCourseOutlineOutcomesFromCourseInstance,
      selectedFlowProgramVersion: state.GeneralProgramReducer.selectedFlowProgramVersion,
    indicatorNameAutocomplete:
      state.GeneralProgramReducer.indicatorNameAutocomplete,
    parentIdAutocomplete: state.GeneralProgramReducer.parentIdAutocomplete,
  });
  
  export default connect(mapStateToProps)(FormCourseOutcomeInstanceFormik);
  