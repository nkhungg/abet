import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { withFormik } from "formik";
import * as Yup from "yup";
import { connect } from "react-redux";
import { Descriptions } from "antd";
import { Editor } from "@tinymce/tinymce-react";
import { editCourseInstanceOutlineActionApi, getCourseInstanceOutlineActionApi } from "../../../../../../actions/api-actions/ProgramAction";


function OutlineGeneralInstance(props) {

    const dispatch = useDispatch();
  let { values, handleChange, handleSubmit, setFieldValue, setValues } = props;
  const {
    selectedFlowProgramVersion,
    courseInstanceOutline,
    courseIdListFromCourseOutline,
  } = useSelector((state) => state.GeneralProgramReducer);
  const [isEdit, setEdit] = useState(false);
  const { programVersionInfo, courseId } = selectedFlowProgramVersion;

  useEffect(() => {
    dispatch(getCourseInstanceOutlineActionApi(programVersionInfo, courseId))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseIdListFromCourseOutline]);

  const hideEditForm = (e, isCancel = false) => {
    if (isCancel) {
      setValues(courseInstanceOutline?.data)
    }
    setEdit(false);
    document
      .getElementById("fieldset-general")
      .setAttribute("disabled", "disabled");
  };

  const showEditForm = () => {
    setEdit(true);
    document.getElementById("fieldset-general").removeAttribute("disabled");
  };

  const handleEditorChangEevaluationForm = (content, editor) => {
    setFieldValue("evaluationForm", content);
  };

  const handleEditorChangeNote = (content, editor) => {
    setFieldValue("note", content);
  };

  const changeType = (e) => {
    setFieldValue("type", e.target.value)
  }

    return (
        <div>
      <form onSubmit={handleSubmit}>
        <fieldset id="fieldset-general" disabled="disabled">
          <Descriptions
            column={6}
            size="small"
            bordered={true}
            labelStyle={{ overflowX: "auto" }}
          >
            {/* ROW 1 */}

            <Descriptions.Item label="MSMH" span={2} className="m-w-100">
              <input
                name="courseId"
                value={values?.courseId || ""}
                onChange={handleChange}
                className="outline-general-input"
                type="text"
                disabled
              />
            </Descriptions.Item>
            <Descriptions.Item label="Số tín chỉ" span={2} className="m-w-100">
              <input
                name="credit"
                value={values?.credit || ""}
                onChange={handleChange}
                className="outline-general-input"
                type="text"
              />
            </Descriptions.Item>
            <Descriptions.Item
              label="Môn ĐA, TT, LV"
              span={2}
              className="m-w-100"
            >
              <select
                name="type"
                value={values?.type || ""}
                className="form-control"
                onChange={(e) => changeType(e)}
              >
                <option value="">No select</option>
                <option value="da">ĐA</option>
                <option value="tl">TL</option>
                <option value="lv">LV</option>
              </select>
            </Descriptions.Item>

            {/* ROW 2 */}

            <Descriptions.Item label="Số tiết"></Descriptions.Item>
            <Descriptions.Item label="Tổng">
              <input
                name="stTong"
                value={values?.stTong || ""}
                onChange={handleChange}
                className="outline-general-input"
                type="text"
              />
            </Descriptions.Item>
            <Descriptions.Item label="LT">
              <input
                name="stLt"
                value={values?.stLt || ""}
                onChange={handleChange}
                className="outline-general-input"
                type="text"
              />
            </Descriptions.Item>
            <Descriptions.Item label="TH">
              <input
                name="stTh"
                value={values?.stTh || ""}
                onChange={handleChange}
                className="outline-general-input"
                type="text"
              />
            </Descriptions.Item>
            <Descriptions.Item label="TN">
              <input
                name="stTn"
                value={values?.stTn || ""}
                onChange={handleChange}
                className="outline-general-input"
                type="text"
              />
            </Descriptions.Item>
            <Descriptions.Item label="BTL/TL">
              <input
                name="stBtlTl"
                value={values?.stBtlTl || ""}
                onChange={handleChange}
                className="outline-general-input"
                type="text"
              />
            </Descriptions.Item>

            {/* ROW 3 */}
            <Descriptions.Item label="Tỉ lệ đánh giá"></Descriptions.Item>
            <Descriptions.Item label="BT">
              <input
                name="tlBt"
                value={values?.tlBt || ""}
                onChange={handleChange}
                className="outline-general-input"
                type="text"
              />
            </Descriptions.Item>
            <Descriptions.Item label="TN">
              <input
                name="tlTn"
                value={values?.tlTn || ""}
                onChange={handleChange}
                className="outline-general-input"
                type="text"
              />
            </Descriptions.Item>
            <Descriptions.Item label="KT">
              <input
                name="tlKt"
                value={values?.tlKt || ""}
                onChange={handleChange}
                className="outline-general-input"
                type="text"
              />
            </Descriptions.Item>
            <Descriptions.Item label="BTL/TL">
              <input
                name="tlBtlTl"
                value={values?.tlBtlTl || ""}
                onChange={handleChange}
                className="outline-general-input"
                type="text"
              />
            </Descriptions.Item>
            <Descriptions.Item label="THI">
              <input
                name="facultyInCharge"
                value={values?.tlThi || ""}
                onChange={handleChange}
                className="outline-general-input"
                type="text"
              />
            </Descriptions.Item>

            {/* ROW 4 */}

            <Descriptions.Item
              label="Môn tiên quyết"
              span={2}
              className="m-w-100"
            >
                {
                    (values || {}).prerequisiteCourseIdList?.map((course, idx) => {
                        return <span>{course}</span>
                    })
                }
            </Descriptions.Item>
            <Descriptions.Item
              label="Môn học trước"
              span={2}
              className="m-w-100"
            >
                {
                    (values || {}).priorCourseIdList?.map((course, idx) => {
                        return <span>{course}</span>
                    })
                }
            </Descriptions.Item>
            <Descriptions.Item
              label="Môn song hành"
              span={2}
              className="m-w-100"
            >
                {
                    (values || {}).parallelCourseIdList?.map((course, idx) => {
                        return <span>{course}</span>
                    })
                }
            </Descriptions.Item>

            {/* ROW 5 */}

            <Descriptions.Item label="CTĐT ngành" span={2} className="m-w-100">
              <input
                name="ctdt"
                value={values?.ctdt || ""}
                onChange={handleChange}
                className="outline-general-input w-100"
                type="text"
              />
            </Descriptions.Item>
            <Descriptions.Item
              label="Trình độ đào tạo"
              span={2}
              className="m-w-100"
            >
              <input
                name="trainingDegree"
                value={values?.trainingDegree || ""}
                onChange={handleChange}
                className="outline-general-input w-100"
                type="text"
              />
            </Descriptions.Item>
            <Descriptions.Item
              label="Cấp độ môn học"
              span={2}
              className="m-w-100"
            >
              <input
                name="groups"
                value={values?.groups || ""}
                onChange={handleChange}
                className="outline-general-input w-100"
                type="text"
              />
            </Descriptions.Item>

            {/* ROW 6 */}

            <Descriptions.Item
              label="Hình thức đánh giá"
              span={6}
              className="m-w-100"
            >
              <Editor
                className="outline-general-input w-100"
                name="evaluationForm"
                value={values?.evaluationForm || ""}
                disabled={!isEdit}
                id="evaluation-form-editor"
                init={{
                  selector: "textarea#myTextArea1",
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
                onEditorChange={handleEditorChangEevaluationForm}
              />
            </Descriptions.Item>
            <Descriptions.Item
              label="Ghi chú khác"
              span={6}
              className="m-w-100"
            >
              <Editor
                className="outline-general-input w-100"
                name="note"
                id="note-form-editor"
                disabled={!isEdit}
                value={values?.note || ""}
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
                onEditorChange={handleEditorChangeNote}
              />
            </Descriptions.Item>
          </Descriptions>
        </fieldset>
        {isEdit ? (
          <div className="mt-2 d-flex justify-content-start">
            <button
              onClick={(e) => hideEditForm(e, false)}
              type="button"
              className="px-3 mb-2 btn mr-3 text-white btn-edit-general"
            >
              Update
            </button>
            <button
              onClick={(e) => hideEditForm(e, true)}
              type="submit"
              className="px-3 mb-2 btn mr-3 text-white btn-edit-general"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="mt-2 d-flex justify-content-start">
            <button
              onClick={() => showEditForm()}
              type="submit"
              className="px-3 mb-2 btn mr-2 text-white btn-edit-general"
            >
              Edit
            </button>
          </div>
        )}
      </form>
    </div>
    )
}

const OutlineGeneralInstanceFormik = withFormik({
    enableReinitialize: true,
    form: 'OutlineGeneralInstanceFormik',
    mapPropsToValues: (props) => {
      let { courseInstanceOutline } = props;
      if (!courseInstanceOutline || (!Object.keys(courseInstanceOutline) || []).length || !courseInstanceOutline.data) {
        return;
      }
      let {
        courseId,
        stTong,
        stLt,
        stTh,
        stTn,
        stBtlTl,
        type,
        tlBt,
        tlTn,
        tlKt,
        tlBtlTl,
        tlThi,
        evaluationForm,
        ctdt,
        trainingDegree,
        groups,
        note,
        credit,
      } = courseInstanceOutline.data;
  
      return {
        courseId,
        stTong,
        stLt,
        stTh,
        stTn,
        stBtlTl,
        type,
        tlBt,
        tlTn,
        tlKt,
        tlBtlTl,
        tlThi,
        evaluationForm,
        ctdt,
        trainingDegree,
        groups,
        note,
        credit,
        prerequisiteCourseIdList: courseInstanceOutline.data.prerequisiteCourseIdList,
        parallelCourseIdList: courseInstanceOutline.data.parallelCourseIdList,
        priorCourseIdList: courseInstanceOutline.data.priorCourseIdList,
      };
    },
    validationSchema: Yup.object().shape({
      //  telephone: Yup.string().required("Course description is required!"),
    }),
    handleSubmit: (values, { props, setSubmitting }) => {
      let { selectedFlowProgramVersion } = props;
      let { programVersionInfo, courseId } = selectedFlowProgramVersion;
      props.dispatch(editCourseInstanceOutlineActionApi(programVersionInfo, courseId, values));
    },
  })(OutlineGeneralInstance);
  
  const mapStateToProps = (state) => ({
    courseInstanceOutline: state.GeneralProgramReducer.courseInstanceOutline,
    selectedFlowProgramVersion: state.GeneralProgramReducer.selectedFlowProgramVersion,
    courseIdListFromCourseOutline:
      state.GeneralProgramReducer.courseIdListFromCourseOutline,
  });
  
  export default connect(mapStateToProps)(OutlineGeneralInstanceFormik);