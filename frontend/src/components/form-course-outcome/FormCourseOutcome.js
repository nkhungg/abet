import React, { useEffect } from "react";
import { Popconfirm } from "antd";
import { connect } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { withFormik } from "formik";
import {
  deleteCourseOutcomeActionApi,
  editCourseOutcomeActionApi,
  getIndicatorAutocompleteActionApi,
  getParentOutcomeAutocompleteActionApi,
  postNewCourseOutcomeActionApi,
} from "../../actions/api-actions/ProgramAction";
import { Select } from 'antd';

const { Option } = Select;
const textConfirm = "Are you sure to delete this task?";

function FormCourseOutcome(props) {
  const dispatch = useDispatch();
  const { values, errors, handleChange, handleSubmit, setFieldValue } = props;
  const {
    selectedFolw,
    editCourseOutcome,
    indicatorNameAutocomplete,
    parentIdAutocomplete,
  } = useSelector((state) => state.GeneralProgramReducer);

  useEffect(() => {
    dispatch(getIndicatorAutocompleteActionApi(selectedFolw.programId));
    dispatch(
      getParentOutcomeAutocompleteActionApi(
        selectedFolw.programId,
        selectedFolw.cirCourseId
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderIndicatorName = () => {
    return indicatorNameAutocomplete?.data?.map((item, idx) => {
      return <Option value={item} key={idx}>{item}</Option>
    })
  }

  const getValueIndicatorName = (value) => {
    setFieldValue('indicatorName', value)
  }

  const renderParentIds = () => {
    return parentIdAutocomplete?.data?.filter(item => item.name !== editCourseOutcome?.name ).map((item, idx) => {
      return <Option value={item.id} key={idx}>{item.name}</Option>
    })
  }

  const getValueParentId = (value) => {
    setFieldValue('parentId', value)
  }

  const confirmDelete = (values) => {
    dispatch(deleteCourseOutcomeActionApi(values));
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
              disabled={props.editCourseOutcome.isEdit}
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
              className='w-100'
              name="indicatorName"
              value={values.indicatorName || ''}
              onChange={getValueIndicatorName}
              showSearch
              style={{ width: 200 }}
              placeholder="Search to Select"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {renderIndicatorName()}
            </Select>
          </div>
        </div>
        <div className="col-12">
          <div className="form-group">
            <label>Parent outcome:</label>
            <br />
            <Select
              className='w-100'
              name="parentId"
              value={values.parentId || ''}
              onChange={getValueParentId}
              showSearch
              style={{ width: 200 }}
              placeholder="Search to Select"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {renderParentIds()}
            </Select>
          </div>
        </div>

        <div className="col-12 mt-5 d-flex justify-content-center">
          {props.editCourseOutcome.isEdit ? (
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

const FormCourseOutcomeFormik = withFormik({
  enableReinitialize: true,
  mapPropsToValues: (props) => {
    const {
      editCourseOutcome,
      selectedFolw,
    } = props;  
    return {
      programId: selectedFolw.programId || editCourseOutcome.programId,
      courseId: selectedFolw.cirCourseId || editCourseOutcome.courseId,
      id: editCourseOutcome?.id,
      name: editCourseOutcome?.name,
      description: editCourseOutcome?.description,
      cdio: editCourseOutcome?.cdio,
      percentIndicator: editCourseOutcome?.percentIndicator,
      indicatorName: editCourseOutcome?.indicatorName,
      parentId: editCourseOutcome?.parentId,
      isEdit: editCourseOutcome?.isEdit,
    };
  },
  validationSchema: Yup.object().shape({
    percentIndicator: Yup.number().min(0).max(100),
  }),
  handleSubmit: (values, { props, setSubmitting }) => {
    const { editCourseOutcome } = props;
    if (editCourseOutcome.isEdit) {
      props.dispatch(editCourseOutcomeActionApi(values));
    } else {
      props.dispatch(postNewCourseOutcomeActionApi(values));
    }
  },
})(FormCourseOutcome);

const mapStateToProps = (state) => ({
  editCourseOutcome: state.GeneralProgramReducer.editCourseOutcome,
  selectedFolw: state.GeneralProgramReducer.selectedFolw,
});

export default connect(mapStateToProps)(FormCourseOutcomeFormik);
