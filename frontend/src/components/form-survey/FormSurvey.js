import React, { useEffect, useState } from "react";
import { withFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "react-redux";
import {
  deleteVersionSurveyActionApi,
  postVersionSurveyActionApi,
  editVersionSurveyActionApi,
  getProgramInfoListActionApi,
} from "../../actions/api-actions/ProgramAction";
import { Popconfirm } from "antd";
import { Select } from "antd";
import { programService } from "../../services/ProgramService";

const { Option } = Select;
const textConfirm = "Are you sure to delete this task?";

function FormSurvey(props) {
  const dispatch = useDispatch();
  const { values, handleChange, handleSubmit, errors, setFieldValue } = props;
  // const [kind, setKind] = useState("");
  const [type, setType] = useState([]);

  const { selectedFlowProgramVersion, programInfo } = useSelector(
    (state) => state.GeneralProgramReducer
  );

  const { programVersionInfo } = selectedFlowProgramVersion;

  const getKndAndType = async () => {
    try {
      let res = await programService.getKindAndTypeSurvey(1, 1000);
      if (res && res.data) {
        let typeList = (((res.data || {}).data || [])[0] || {}).typeList;
        // setKind(res.data.data[0].name);
        setType(typeList);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getKndAndType();
    dispatch(getProgramInfoListActionApi())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const confirmDelete = (values) => {
    let valueUpdate = { ...values, programVersionInfo };
    dispatch(deleteVersionSurveyActionApi(valueUpdate));
  };

  const renderType = () => {
    return type?.map((item, idx) => {
      return (
        <Option value={item.id} key={`${item.id}-${idx}`}>
          {item.name}
        </Option>
      );
    });
  };

  const onChangeType = (e) => {
    setFieldValue("type", e);
  };

  const handleChangeLock = (e) => {
    setFieldValue("lock", e.target.checked);
  };

  const getProgramVersionInfoValue = (value) => {
    setFieldValue('programVersionInfo', value)
    // let programVersionId = value.split('-')[0]
    // dispatch(getCourseInstanceCourseIdsActionApi(programVersionId))
  }

  const renderOptionsProgramInfos = () => {
    return programInfo?.map((item, idx) => {
      return <Option value={item} key={idx}>{item}</Option>
    })
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
            {props.editSurvey.isEdit && (
              <input
                name="programVersionInfo"
                value={values.programVersionInfo || ""}
                onChange={handleChange}
                className="form-control"
                type="text"
                disabled
              />
            )}
            {!props.editSurvey.isEdit && (
              <Select
                className="w-full"
                showSearch
                style={{ width: "100%", height: "32px" }}
                placeholder="Search to Select"
                optionFilterProp="children"
                onChange={getProgramVersionInfoValue}
                filterOption={(input, option) =>
                  option.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {renderOptionsProgramInfos()}
              </Select>
            )}
          </div>
        </div>
        <div className="col-12">
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              name="name"
              value={values.name || ""}
              onChange={handleChange}
              id="name"
              className="form-control"
              type="text"
              disabled={props.editSurvey.isEdit}
            />
            <span className="text-danger">{errors.major}</span>
          </div>
        </div>
        <div className="col-12">
          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              name="description"
              value={values.description || ""}
              onChange={handleChange}
              id="desc"
              rows="2"
              className="text-area form-control"
              type="text"
            />
          </div>
        </div>
        <div className="col-12">
          <div className="form-group">
            <label htmlFor="surveyKindName">
              Kind: <span className="text-danger font-weight-bold">*</span>
            </label>
            <Select
              size="default"
              placeholder="Please select survey kind"
              value={values.surveyKindName || ''}
              // onChange={(e) => onChangeSelectLecturers(e)}
              style={{ width: "100%" }}
              className="general-select-ant mb-4"
              disabled
            ></Select>
          </div>
        </div>

        <div className="col-12">
          <div className="form-group">
            <label htmlFor="type">
              Type: <span className="text-danger font-weight-bold">*</span>
            </label>
            <Select
              size="default"
              placeholder="Please select survey type"
              value={values.type || ""}
              onChange={(e) => onChangeType(e)}
              style={{ width: "100%" }}
              className="general-select-ant mb-4"
            >
              {renderType()}
            </Select>
          </div>
        </div>

        <div className="col-12">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              name="outlineChecked"
              checked={values.lock}
              value={values.lock || 0}
              onChange={(e) => handleChangeLock(e)}
            />
            <label className="form-check-label" htmlFor="exampleCheck1">
              Is survey checked?
            </label>
          </div>
        </div>

        <div className="col-12 mt-5 d-flex justify-content-center">
          {props.editSurvey.isEdit ? (
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

const FormSurveyFormik = withFormik({
  enableReinitialize: true,
  mapPropsToValues: (props) => {
    const { editSurvey } = props;
    return {
      programVersionInfo: editSurvey?.programVersionInfo,
      name: editSurvey?.name,
      description: editSurvey?.description,
      surveyKindName: "CapstoneProject",
      type: editSurvey?.type,
      lock: editSurvey?.lock,
    };
  },
  validationSchema: Yup.object().shape({}),
  handleSubmit: (values, { props, setSubmitting }) => {
    let { editSurvey, dispatch } = props;
    let valueUpdate = { ...values };
    if (editSurvey.isEdit) {
      dispatch(editVersionSurveyActionApi(valueUpdate));
    } else {
      dispatch(postVersionSurveyActionApi(valueUpdate));
    }
  },
})(FormSurvey);

const mapStateToProps = (state) => ({
  editSurvey: state.GeneralProgramReducer.editSurvey,
  selectedFlowProgramVersion:
    state.GeneralProgramReducer.selectedFlowProgramVersion,
});

export default connect(mapStateToProps)(FormSurveyFormik);
