import React, { useRef, useState } from "react";
import { withFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "react-redux";
import {
  editVersionFoundationTestQuestionAnswerActionApi,
  deleteVersionFoundationTestQuestionAnswerActionApi,
  postVersionFoundationTestQuestionAnswerActionApi,
} from "../../actions/api-actions/ProgramAction";
import { Button, Popconfirm } from "antd";

const textConfirm = "Are you sure to delete this task?";

function FormVersionFoundationTestQuestionAnswer(props) {
  const [first, setfirst] = useState(true)
  const dispatch = useDispatch();
  const { values, handleChange, handleSubmit, setFieldValue } = props;
  const refFiles = useRef()

  const {
    selectedFlowProgramVersion,
  } = useSelector((state) => state.GeneralProgramReducer);

  const { programVersionInfo } = selectedFlowProgramVersion;

  const confirmDelete = (values) => {
    let valueUpdate = { ...values, programVersionInfo };
    dispatch(deleteVersionFoundationTestQuestionAnswerActionApi(valueUpdate))
  };

  const handleFileInput = (e) => {
    setfirst(false)
    setFieldValue("image", e.target.files[0]);
  }

  return (
    <div>
      <form className="form-create-course" onSubmit={handleSubmit}>
        <div className="col-12">
          <div className="form-group">
            <label htmlFor="answerId">
              AnswerId:{" "}
              <span className="text-danger font-weight-bold">*</span>
            </label>
            <input
              name="answerId"
              value={values.answerId || ""}
              onChange={handleChange}
              className="form-control"
              type="text"
              disabled={props.editVersionFoundationTestQuestionAnswer.isEdit}
            />
          </div>
        </div>

        <div className="col-12">
          <div className="form-group">
            <label htmlFor="description">
              Description:{" "}
              <span className="text-danger font-weight-bold">*</span>
            </label>
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
            <label htmlFor="image">
              Image File: 
            </label>
            <input
              ref={refFiles}
              style={{display: 'none'}}
              name="image"
              // value={values.imageFile}
              onChange={handleFileInput}
              className="form-control"
              type="file"
            /><br />
            <Button onClick={e => refFiles.current && refFiles.current.click()} className="mr-4">Choose file</Button>
            { (first && values.image) ? <span>{values.image}</span> : '' }
            { (!first && values.image.name) ? <span>{values.image.name}</span> : '' }
          </div>
        </div>

        <div className="col-12 mt-5 d-flex justify-content-center">
          {props.editVersionFoundationTestQuestionAnswer.isEdit ? (
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

const FormVersionFoundationTestQuestionAnswerFormik = withFormik({
  enableReinitialize: true,
  mapPropsToValues: (props) => {
    const { editVersionFoundationTestQuestionAnswer } = props;
    return {
      answerId: editVersionFoundationTestQuestionAnswer?.answerId,
      description: editVersionFoundationTestQuestionAnswer?.description,
      image: editVersionFoundationTestQuestionAnswer?.image,
      questionId: editVersionFoundationTestQuestionAnswer?.questionId,
    };
  },
  validationSchema: Yup.object().shape({}),
  handleSubmit: (values, { props, setSubmitting }) => {
    let { editVersionFoundationTestQuestionAnswer, selectedFlowProgramVersion, dispatch } = props;
    let { programVersionInfo } = selectedFlowProgramVersion;
    let valueUpdate = {...values, programVersionInfo}
    if(editVersionFoundationTestQuestionAnswer.isEdit) {
      dispatch(editVersionFoundationTestQuestionAnswerActionApi(valueUpdate))
    } else {
      dispatch(postVersionFoundationTestQuestionAnswerActionApi(valueUpdate))
    }
  },
})(FormVersionFoundationTestQuestionAnswer);

const mapStateToProps = (state) => ({
  editVersionFoundationTestQuestionAnswer: state.GeneralProgramReducer.editVersionFoundationTestQuestionAnswer,
  selectedFlowProgramVersion:
    state.GeneralProgramReducer.selectedFlowProgramVersion,
});

export default connect(mapStateToProps)(FormVersionFoundationTestQuestionAnswerFormik);

