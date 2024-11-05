import React, { useEffect, useState } from "react";
import { withFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { Popconfirm, Select } from "antd";
import { connect } from "react-redux";
import { Editor } from "@tinymce/tinymce-react";
import { deleteCourseDetailInCourseOutlineActionApi, editCourseDetailInCourseOutlineActionApi, getParentOutcomeAutocompleteActionApi, postCourseDetailInCourseOutlineActionApi } from "../../../../../../../../actions/api-actions/ProgramAction";
import parse from "react-html-parser";
const { Option } = Select;

const textConfirm = "Are you sure to delete this task?";

function FormDetails(props) {
  const dispatch = useDispatch();
  const { values, handleChange, handleSubmit, setFieldValue } = props;
  const { selectedFolw, parentIdAutocomplete } = useSelector((state) => state.GeneralProgramReducer);
  const {programId, cirCourseId} = selectedFolw
  const [outputStandardLocal, setOutputStandardLocaletstate] = useState([])

  const confirmDelete = (value) => {
    dispatch(deleteCourseDetailInCourseOutlineActionApi(value))
  };

  useEffect(() => {
    dispatch(getParentOutcomeAutocompleteActionApi(programId, cirCourseId))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
 

  const handleEditorChangeContent = (content) => {
    setFieldValue("content", content);
  };

  const handleEditorChangeActivities = (reviewAction) => {
    setFieldValue("reviewAction", reviewAction);
  };

  const renderLecturers = () => {
    return parentIdAutocomplete?.data?.map((item, idx) => {
      return <Option title={item.name} value={`${item.id}-${item.name}-${item.description}`} key={`${item.id} - ${item.name}`}>
      {item.name} - {item.description}
    </Option>
    })
  }

  const onChangeSelectLecturers = (value) => {
    document.getElementById('current-lecturers').style.display = 'none'
    setOutputStandardLocaletstate(value);
    let selectedIds = value?.map((item, idx) => {
      let itemInfo = item.split('-')
      return itemInfo[0]
    })
    setFieldValue('outcomeIdList', selectedIds)
  }

  const renderSelectedLecturers = () => {   
    return outputStandardLocal?.map((item, idx) => {
      let infoShow = item.split('-')
      return <p key={idx} className='text-dark'><strong>{infoShow[1]}</strong> <span>{infoShow[2]}</span></p>
    });
  };
  

  return (
    <div>
      <form className="form-create-course" onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-12">
            <div className="form-group">
              <label htmlFor="chapter">
                Chapter: <span className="text-danger font-weight-bold">*</span>
              </label>
              <input
                name="chapter"
                value={values.chapter || ""}
                onChange={handleChange}
                className="form-control"
                type="text"
              />
            </div>
          </div>

          <div className="col-12">
            <div className="form-group">
            <label htmlFor="reviewAction">Output Standard:</label>
              {/* --------- */}
              <Select
                mode="multiple"
                size="default"
                placeholder="Please select"
                // value={lecturers}
                onChange={(value) => onChangeSelectLecturers(value)}
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
              {/* <label htmlFor="outputStandard">Output standard:</label> */}
              <div className="card border-secondary mb-3" style={{ width: "100%" }}>
              <div className="card-header">Output Standard</div>
              <div id='content-lecturers' className="card-body text-info">
                <span className='text-dark' id="current-lecturers">{parse(values.outputStandard || '')}</span>
                {renderSelectedLecturers()}
              </div>
            </div>
            </div>
          </div>

          <div className="col-12">
            <div className="form-group">
              <label htmlFor="content">Content:</label>
              <Editor
                name="content"
                value={values.content || ""}
                init={{
                  selector: "textarea#myTextArea",
                  height: 200,
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
        </div>

        <div className="row">
          

          <div className="col-12">
            <div className="form-group">
              <label htmlFor="reviewAction">Review action:</label>
              <Editor
                name="reviewAction"
                value={values.reviewAction || ""}
                init={{
                  selector: "textarea#myTextArea",
                  height: 200,

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
                onEditorChange={handleEditorChangeActivities}
              />
            </div>
          </div>
        </div>

        <div className="col-12 mt-2 d-flex justify-content-center">
          { props.editDetailsInCourseOutline.isEdit &&
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
          }

          <button type="submit" className="btn btn-primary ml-2">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

const FormDetailsFormik = withFormik({
  enableReinitialize: true,
  mapPropsToValues: (props) => {
    const { editDetailsInCourseOutline } = props;
    console.log("editDetailsInCourseOutline", editDetailsInCourseOutline)
    return {
      programId: editDetailsInCourseOutline?.programId,
      courseId: editDetailsInCourseOutline?.courseId,
      id: editDetailsInCourseOutline?.id,
      chapter: editDetailsInCourseOutline?.chapter,
      content: editDetailsInCourseOutline?.content,
      outputStandard: editDetailsInCourseOutline?.outputStandard,
      reviewAction: editDetailsInCourseOutline?.reviewAction,
      type: editDetailsInCourseOutline?.type,
      outcomeIdList: [],
    };
  },
  validationSchema: Yup.object().shape({}),
  handleSubmit: (values, { props, setSubmitting }) => {
    const { editDetailsInCourseOutline } = props;
    values.outputStandard = document.getElementById('content-lecturers').innerHTML
    if(editDetailsInCourseOutline.isEdit) {
      props.dispatch(editCourseDetailInCourseOutlineActionApi(values))
    } else {
      props.dispatch(postCourseDetailInCourseOutlineActionApi(values))
    }
  },
})(FormDetails);

const mapStateToProps = (state) => ({
  editDetailsInCourseOutline:
    state.GeneralProgramReducer.editDetailsInCourseOutline,
});

export default connect(mapStateToProps)(FormDetailsFormik);
