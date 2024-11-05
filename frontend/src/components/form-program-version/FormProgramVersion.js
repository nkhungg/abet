import React, { useEffect } from "react";
import { withFormik } from "formik";
import { Popconfirm } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "react-redux";
import * as Yup from "yup";
import { deleteProgramVersionActionApi, editProgramVersionActionApi, getProgramVersionIdsActionApi, postNewProgramVersionActionApi } from "../../actions/api-actions/ProgramAction";
import { Select } from 'antd';

const { Option } = Select;

const textConfirm = "Are you sure to delete this task?";

function FormProgramVersion(props) {
  const dispatch = useDispatch();
  const { values, handleChange, handleSubmit, setFieldValue } = props;
  const { programVersionIds } = useSelector(state => state.GeneralProgramReducer)


  const renderOptionsProgramVersionIds = () => {
    return programVersionIds.map((item, idx) => {
      return <Option key={idx} value={item}>{item}</Option>
    })
  }

  useEffect(() => {
    dispatch(getProgramVersionIdsActionApi());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const confirmDelete = (values) => {
    dispatch(deleteProgramVersionActionApi(values))
  };

  const getProgramIdOption = (value) => {
    setFieldValue('programId', value)
  }

  return (
    <div>
      <form className="form-create-course" onSubmit={handleSubmit}>
        <div className="col-12">
          <div className="form-group">
            <label htmlFor="programId">
              Program Id:{" "}
              <span className="text-danger font-weight-bold">*</span>
            </label><br />
            {
              props.editProgramVersion.isEdit &&
              <input
                name="programId"
                value={values.programId || ""}
                onChange={handleChange}
                className="form-control"
                type="text"
                disabled
              />
            }
            
            {
              !props.editProgramVersion.isEdit && 
              <Select
                className='w-100'
                showSearch
                placeholder="Search to Select"
                optionFilterProp="children"
                onChange={getProgramIdOption}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                filterSort={(optionA, optionB) =>
                  optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                }
              >
                {renderOptionsProgramVersionIds()}
            </Select>
            }
          </div>
        </div>
        <div className="col-12">
          <div className="form-group">
            <label>Year:</label>
            <input
              name="year"
              value={values.year || ""}
              onChange={handleChange}
              className="form-control"
              type="number"
            />
          </div>
        </div>
        <div className="col-12">
          <div className="form-group">
            <label>Semester:</label>
            <input
              name="semester"
              value={values.semester || ""}
              onChange={handleChange}
              className="form-control"
              type="number"
            />
          </div>
        </div>
       
        <div className="col-12 mt-5 d-flex justify-content-center">
          {props.editProgramVersion.isEdit ? (
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

const FormProgramVersionFormik = withFormik({
  enableReinitialize: true,
  mapPropsToValues: (props) => {
    const { editProgramVersion } = props;
    return {
      id: editProgramVersion?.id,
      year: editProgramVersion?.year,
      semester: editProgramVersion?.semester,
      programId: editProgramVersion?.programId,
    };
  },
  validationSchema: Yup.object().shape({}),
  handleSubmit: (values, { props, setSubmitting }) => {
    const { editProgramVersion, dispatch } = props;
    if(editProgramVersion.isEdit) {
        dispatch(editProgramVersionActionApi(values))
    } else {
        dispatch(postNewProgramVersionActionApi(values))
    }
  },
})(FormProgramVersion);

const mapStateToProps = (state) => ({
  editProgramVersion: state.GeneralProgramReducer.editProgramVersion,
});

export default connect(mapStateToProps)(FormProgramVersionFormik);
