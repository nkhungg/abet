import React from "react";
import { withFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "react-redux";
import {
    deleteVersionCourseInstanceTestQuestionActionApi,
  editVersionCourseInstanceTestQuestionActionApi,
  postVersionCourseInstanceTestQuestionActionApi,
} from "../../actions/api-actions/ProgramAction";
import { Popconfirm } from "antd";
import { Editor } from "@tinymce/tinymce-react";

const textConfirm = "Are you sure to delete this task?";

function FormVersionCourseInstanceTestQuestion(props) {
  const dispatch = useDispatch();
  const { values, handleChange, handleSubmit, setFieldValue } = props;

  const {
    selectedFlowProgramVersion,
  } = useSelector((state) => state.GeneralProgramReducer);

  const { testId, classId } = selectedFlowProgramVersion;

  const confirmDelete = (values) => {
    let valueUpdate = { ...values, testId, classId };
    dispatch(deleteVersionCourseInstanceTestQuestionActionApi(valueUpdate));
  };

  const handleEditorChangeContent =  (content, editor) => {
    setFieldValue("content", content);
  };

  return (
    <div>
      <form className="form-create-course" onSubmit={handleSubmit}>
        <div className="col-12">
          <div className="form-group">
            <label htmlFor="name">
              Name: <span className="text-danger font-weight-bold">*</span>
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
            <label htmlFor="content">
              Content: <span className="text-danger font-weight-bold">*</span>
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
            <label htmlFor="percent">
              Percent: <span className="text-danger font-weight-bold">*</span>
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
            <label htmlFor="maxScore">
              Max score: <span className="text-danger font-weight-bold">*</span>
            </label>
            <input
              name="maxScore"
              value={values.maxScore || ""}
              onChange={handleChange}
              className="form-control"
              type="number" 
              step="0.01"
            />
          </div>
        </div>

        <div className="col-12 mt-5 d-flex justify-content-center">
          {props.editVersionCourseInstanceTestQuestion.isEdit ? (
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

const FormVersionCourseInstanceTestQuestionFormik = withFormik({
  enableReinitialize: true,
  mapPropsToValues: (props) => {
    const { editVersionCourseInstanceTestQuestion } = props;
    return {
      percent: editVersionCourseInstanceTestQuestion?.percent,
      name: editVersionCourseInstanceTestQuestion?.name,
      content: editVersionCourseInstanceTestQuestion?.content,
      maxScore: editVersionCourseInstanceTestQuestion?.maxScore,
      id: editVersionCourseInstanceTestQuestion?.id,
      classId: editVersionCourseInstanceTestQuestion?.classId,
    };
  },
  validationSchema: Yup.object().shape({}),
  handleSubmit: (values, { props, setSubmitting }) => {
    let {
      editVersionCourseInstanceTestQuestion,
      selectedFlowProgramVersion,
      dispatch,
    } = props;
    let { testId } = selectedFlowProgramVersion;
    let valueUpdate = { ...values, testId };
    if (editVersionCourseInstanceTestQuestion.isEdit) {
      dispatch(editVersionCourseInstanceTestQuestionActionApi(valueUpdate));
    } else {
      dispatch(postVersionCourseInstanceTestQuestionActionApi(valueUpdate));
    }
  },
})(FormVersionCourseInstanceTestQuestion);

const mapStateToProps = (state) => ({
  editVersionCourseInstanceTestQuestion:
    state.GeneralProgramReducer.editVersionCourseInstanceTestQuestion,
  selectedFlowProgramVersion:
    state.GeneralProgramReducer.selectedFlowProgramVersion,
});

export default connect(mapStateToProps)(
  FormVersionCourseInstanceTestQuestionFormik
);
