import React, { useEffect } from "react";
import { Popconfirm } from "antd";
import { connect } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { withFormik } from "formik";
import {
  getIndicatorAutocompleteActionApi,
  getParentOutcomeAutocompleteActionApi,
  deleteCourseOutcomsInCourseInstanceActionApi,
  editCourseOutcomsInCourseInstanceActionApi,
  postCourseOutcomsInCourseInstanceActionApi,
  getParentOutcomeAutocompleteInCourseInstanceActionApi,
} from "../../actions/api-actions/ProgramAction";
import { Select } from "antd";

const textConfirm = "Are you sure to delete this task?";

const { Option } = Select;

function FormOutcomesFromCourseInstance(props) {
  const dispatch = useDispatch();
  const { values, errors, handleChange, handleSubmit, setFieldValue } = props;
  const {
    selectedFlowProgramVersion,
    editCourseOutcomesFromCourseInstance,
    indicatorNameAutocomplete,
    parentIdAutocompleteCourseInstance,
  } = useSelector((state) => state.GeneralProgramReducer);

  const {
    programVersionInfo,
    programVersionId,
    courseId,
  } = selectedFlowProgramVersion;

  useEffect(() => {
    dispatch(getParentOutcomeAutocompleteActionApi(programVersionId, courseId));
    dispatch(getIndicatorAutocompleteActionApi(programVersionId));
    dispatch(
      getParentOutcomeAutocompleteInCourseInstanceActionApi(
        programVersionInfo,
        courseId
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    let { name } = editCourseOutcomesFromCourseInstance;
    return parentIdAutocompleteCourseInstance?.data
      ?.filter((item) => item.name !== name)
      .map((item, idx) => {
        return (
          <Option key={idx} value={item.id}>
            {item.name}
          </Option>
        );
      });
  };

  const getIndicatorName = (value) => {
    setFieldValue("indicatorName", value);
  };

  const getParentId = (value) => {
    setFieldValue("parentId", value);
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
              disabled={props.editCourseOutcomesFromCourseInstance.isEdit}
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
              value={values.indicatorName || ""}
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
          {props.editCourseOutcomesFromCourseInstance.isEdit && (
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
  );
}

const FormOutcomesFromCourseInstanceFormik = withFormik({
  enableReinitialize: true,
  mapPropsToValues: (props) => {
    const {
      editCourseOutcomesFromCourseInstance,
      selectedFlowProgramVersion,
    } = props;
    return {
      programId: selectedFlowProgramVersion?.programVersionId,
      courseId: selectedFlowProgramVersion?.courseId,
      id: editCourseOutcomesFromCourseInstance?.id,
      name: editCourseOutcomesFromCourseInstance?.name,
      description: editCourseOutcomesFromCourseInstance?.description,
      cdio: editCourseOutcomesFromCourseInstance?.cdio,
      percentIndicator: editCourseOutcomesFromCourseInstance?.percentIndicator,
      indicatorName: editCourseOutcomesFromCourseInstance?.indicatorName,
      parentId: editCourseOutcomesFromCourseInstance?.parentId,
      isEdit: editCourseOutcomesFromCourseInstance?.isEdit,
      programInstanceId: selectedFlowProgramVersion?.programInstanceId,
    };
  },
  validationSchema: Yup.object().shape({
    percentIndicator: Yup.number().min(0).max(100),
  }),
  handleSubmit: (values, { props, setSubmitting }) => {
    const {
      editCourseOutcomesFromCourseInstance,
      selectedFlowProgramVersion,
    } = props;
    const { programVersionInfo } = selectedFlowProgramVersion;
    let valueUpdate = { ...values, programVersionInfo };
 
    if (editCourseOutcomesFromCourseInstance.isEdit) {
      props.dispatch(editCourseOutcomsInCourseInstanceActionApi(valueUpdate));
    } else {
      props.dispatch(postCourseOutcomsInCourseInstanceActionApi(valueUpdate));
    }
  },
})(FormOutcomesFromCourseInstance);

const mapStateToProps = (state) => ({
  editCourseOutcomesFromCourseInstance:
    state.GeneralProgramReducer.editCourseOutcomesFromCourseInstance,
  selectedFlowProgramVersion:
    state.GeneralProgramReducer.selectedFlowProgramVersion,
  indicatorNameAutocomplete:
    state.GeneralProgramReducer.indicatorNameAutocomplete,
  parentIdAutocomplete: state.GeneralProgramReducer.parentIdAutocomplete,
});

export default connect(mapStateToProps)(FormOutcomesFromCourseInstanceFormik);
