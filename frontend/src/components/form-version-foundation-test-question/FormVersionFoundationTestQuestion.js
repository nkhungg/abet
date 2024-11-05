import React, { useEffect, useRef } from "react";
import { withFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "react-redux";
import {
  deleteVersionFoundationTestQuestionActionApi,
  editVersionFoundationTestQuestionActionApi,
  getAllIndicatorsByOutcomeListActionApi,
  getAllOutcomeListActionApi,
  getLecturerListActionApi,
  getVersionFoundationTestSubjectActionApi,
  postVersionFoundationTestQuestionActionApi,
} from "../../actions/api-actions/ProgramAction";
import { Button, Popconfirm } from "antd";
import { Select } from "antd";
import { Editor } from "@tinymce/tinymce-react";
import { useState } from "react";

const { Option } = Select;
const textConfirm = "Are you sure to delete this task?";

function FormVersionFoundationTestQuestion(props) {
  const [first, setfirst] = useState(true)
  const dispatch = useDispatch();
  const refFiles = useRef()
  // const [answerNum, setAnswerNum] = useState([]);
  const { values, handleChange, handleSubmit, setFieldValue } = props;

  const {
    selectedFlowProgramVersion,
    allIndicatorByOutcomeName, // indicator by outcome
    allOutcomeList, // outcomeList
    lecturersFromCourseOutline, // lecturereId
    versionFoundationTestSubjects, // subjectId
  } = useSelector((state) => state.GeneralProgramReducer);

  const { programVersionInfo, programVersionId } = selectedFlowProgramVersion;

  useEffect(() => {
    dispatch(getAllOutcomeListActionApi(programVersionId));
    dispatch(getLecturerListActionApi(1, 1000))
    dispatch(getVersionFoundationTestSubjectActionApi(programVersionInfo, 1, 1000))
    if(props.editVersionFoundationTestQuestion.isEdit) {
      if(values.outcomeName) {
        dispatch(getAllIndicatorsByOutcomeListActionApi(programVersionId, values.outcomeName, 1, 1000))
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [programVersionId]);

  const confirmDelete = (values) => {
    let valueUpdate = { ...values, programVersionInfo };
    dispatch(deleteVersionFoundationTestQuestionActionApi(valueUpdate))
  };

  const renderOutcomeList = () => {
    return allOutcomeList?.data?.map((item, idx) => {
      return (
        <Option title={item.description} value={item.outcomeName} key={idx}>
          {item.outcomeName} - {item.description}
        </Option>
      );
    });
  }

  const renderIndicators = () => {
    return allIndicatorByOutcomeName?.data?.map((item, idx) => {
      return (
        <Option value={item.name} key={idx}>
          {item.name} - {item.description}
        </Option>
      );
    });
  };

  const renderLecturerList = () => {
    return lecturersFromCourseOutline?.data?.map((item, idx) => {
      return (
        <Option value={item.id} key={idx}>
          {item.id} - {item.name}
        </Option>
      );
    });
  }

  const renderSubjectList = () => {
    return versionFoundationTestSubjects?.data?.map((item, idx) => {
      return (
        <Option value={item.id} key={idx}>
          {item.subjectName}
        </Option>
      );
    });
  }


  const changeIndicatorName = (e) => {
    setFieldValue("indicatorName", e);
  };

  const handleEditorChangeContent = (content, editor) => {
    setFieldValue("content", content);
  };

  const changeOutcomeName = (e) => {
    setFieldValue("outcomeName", e)
    dispatch(getAllIndicatorsByOutcomeListActionApi(programVersionId, e, 1, 1000))
  }

  const changeLevel = (e) => {
    setFieldValue("level", e);
  }

  const changeLecturerId = (e) => {
    setFieldValue("lecturerId", e);
  }

  const changeSubjectId = (e) => {
    console.log("subjectId", e)
    setFieldValue("subjectId", e);
  }

  const handleFileInput = (e) => {
    setfirst(false)
    setFieldValue("image", e.target.files[0]);
  }
  return (
    <div>
      <form className="form-create-course" onSubmit={handleSubmit}>
        <div className="col-12">
          <div className="form-group">
            <label htmlFor="name">
              Name:{" "}
              <span className="text-danger font-weight-bold">*</span>
            </label>
            <input
              name="name"
              value={values.name || ""}
              onChange={handleChange}
              className="form-control"
              type="number"
              disabled={props.editVersionFoundationTestQuestion.isEdit}
            />
          </div>
        </div>

        <div className="col-12">
          <div className="form-group">
            <label htmlFor="content">
              Content:
            </label>
            <Editor
              className="outline-general-input w-100"
              name="content"
              id="note-form-editor"
              value={values?.content || ""}
              init={{
                selector: "textarea#myTextArea",
                height: 150,
                menubar: false,
                plugins: [
                  "advlist autolink lists link image charmap print preview anchor",
                  "searchreplace visualblocks code fullscreen",
                  "insertdatetime media table paste code help wordcount",
                ],
                toolbar:
                  "undo redo | formatselect | bold italic underline forecolor backcolor | \
                                    alignleft aligncenter alignright alignjustify | \
                                    bullist numlist outdent indent | removeformat | help",
              }}
              onEditorChange={handleEditorChangeContent}
            />
          </div>
        </div>

        <div className="col-12">
          <div className="form-group">
            <label htmlFor="outcomeName">
              Outcome: <span className="text-danger font-weight-bold">*</span>
            </label>
            <Select
              size="default"
              placeholder="Please select"
              value={values.outcomeName || ""}
              onChange={(e) => changeOutcomeName(e)}
              style={{ width: "100%" }}
              className="general-select-ant mb-4"
              filterOption={(keyword, option) =>
                option.children
                  .toString()
                  .toLowerCase()
                  .includes(keyword.toLowerCase())
              }
            >
              {renderOutcomeList()}
            </Select>
          </div>
        </div>

        <div className="col-12">
          <div className="form-group">
            <label htmlFor="indicatorName">
              Indicator: <span className="text-danger font-weight-bold">*</span>
            </label>
            <Select
              size="default"
              placeholder="Please select"
              value={values.indicatorName || ""}
              onChange={(e) => changeIndicatorName(e)}
              style={{ width: "100%" }}
              className="general-select-ant mb-4"
              filterOption={(keyword, option) =>
                option.children
                  .toString()
                  .toLowerCase()
                  .includes(keyword.toLowerCase())
              }
            >
              {renderIndicators()}
            </Select>
          </div>
        </div>

        <div className="col-12">
          <div className="form-group">
            <label htmlFor="level">
              Level:
            </label>
            <Select
              size="default"
              placeholder="Please select"
              value={values.level || ""}
              onChange={(e) => changeLevel(e)}
              style={{ width: "100%" }}
              className="general-select-ant mb-4"
            >
              <Option value="Easy" key="Easy">Easy</Option>
              <Option value="Intermediate" key="Intermediate">Intermediate</Option>
              <Option value="Hard" key="Hard">Hard</Option>
            </Select>
          </div>
        </div>

        <div className="col-12">
          <div className="form-group">
            <label htmlFor="image">
              Image File (if any):
            </label>
            <input
              ref={refFiles}
              style={{display: 'none'}}
              name="image"
              // value={values.imageFile || ''}
              onChange={handleFileInput}
              className="form-control"
              type="file"
            /><br />
            <Button onClick={e => refFiles.current && refFiles.current.click()} className="mr-4">Choose file</Button>
            { (first && values.image) ? <span>{values.image}</span> : '' }
            { (!first && values.image.name) ? <span>{values.image.name}</span> : '' }
          </div>
        </div>

        <div className="col-12">
          <div className="form-group">
            <label htmlFor="lecturerId">
              Lecturer :
            </label>
            <Select
              size="default"
              placeholder="Please select"
              value={values.lecturerId || ""}
              onChange={(e) => changeLecturerId(e)}
              style={{ width: "100%" }}
              className="general-select-ant mb-4"
            >
              {renderLecturerList()}
            </Select>
          </div>
        </div>


        <div className="col-12">
          <div className="form-group">
            <label htmlFor="subjectId">
              Subject :
            </label>
            <Select
              size="default"
              placeholder="Please select"
              value={values.subjectId || ""}
              onChange={(e) => changeSubjectId(e)}
              style={{ width: "100%" }}
              className="general-select-ant mb-4"
            >
              {renderSubjectList()}
            </Select>
          </div>
        </div>

        <div className="col-12">
          <div className="form-group">
            <label htmlFor="percent">
              Percent:
            </label>
            <input
              name="percent"
              value={values.percent || ""}
              onChange={handleChange}
              className="form-control"
              type="number"
            />
          </div>
        </div>

        <div className="col-12">
          <div className="form-group">
            <label htmlFor="time">
              Time:
            </label>
            <input
              name="time"
              value={values.time || ""}
              onChange={handleChange}
              className="form-control"
              type="number"
            />
          </div>
        </div>

        <div className="col-12 mt-5 d-flex justify-content-center">
          {props.editVersionFoundationTestQuestion.isEdit ? (
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

const FormVersionFoundationTestQuestionFormik = withFormik({
  enableReinitialize: true,
  mapPropsToValues: (props) => {
    const { editVersionFoundationTestQuestion } = props;
    // if(editVersionFoundationTestQuestion.isEdit) {

    // }
    return { 
      id: editVersionFoundationTestQuestion?.id,
      name: editVersionFoundationTestQuestion?.name,
      content: editVersionFoundationTestQuestion?.content,
      percent: editVersionFoundationTestQuestion?.percent,
      outcomeName: editVersionFoundationTestQuestion?.outcomeName, // select
      indicatorName: editVersionFoundationTestQuestion?.indicatorName, // select
      level: editVersionFoundationTestQuestion?.level,
      image: editVersionFoundationTestQuestion?.image,
      lecturerId: editVersionFoundationTestQuestion?.lecturerId,
      subjectId: editVersionFoundationTestQuestion?.subjectId,
      time: editVersionFoundationTestQuestion?.time,
    };
  },
  validationSchema: Yup.object().shape({}),
  handleSubmit: (values, { props, setSubmitting }) => {
    let { editVersionFoundationTestQuestion, selectedFlowProgramVersion, dispatch } = props;
    let { programVersionInfo } = selectedFlowProgramVersion;
    let valueUpdate = { ...values, programVersionInfo }
    if (editVersionFoundationTestQuestion.isEdit) {
      dispatch(editVersionFoundationTestQuestionActionApi(valueUpdate))
    } else {
      dispatch(postVersionFoundationTestQuestionActionApi(valueUpdate))
    }
  },
})(FormVersionFoundationTestQuestion);

const mapStateToProps = (state) => ({
  editVersionFoundationTestQuestion: state.GeneralProgramReducer.editVersionFoundationTestQuestion,
  selectedFlowProgramVersion:
    state.GeneralProgramReducer.selectedFlowProgramVersion,
});

export default connect(mapStateToProps)(FormVersionFoundationTestQuestionFormik);
