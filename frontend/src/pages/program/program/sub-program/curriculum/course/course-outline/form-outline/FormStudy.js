import { Editor } from "@tinymce/tinymce-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "antd";
import { editCourseOutlineEditorActionApi } from "../../../../../../../../actions/api-actions/ProgramAction";

export default function FormStudy(props) {
  const { selectedFolw, courseOutlineInfo } = useSelector((state) => state.GeneralProgramReducer);
  let guidelineJSX = courseOutlineInfo?.data?.guideline;
  const { programId, cirCourseId } = selectedFolw

  const dispatch = useDispatch();
  const [guideline, setGuideline] = useState(guidelineJSX);

  const handleEditorChange = (content, editor) => {
    setGuideline(content);
  };

  const hideEditor = async (isUpdate) => {
    let data = {guideline: isUpdate ? guideline : guidelineJSX}
    await dispatch(editCourseOutlineEditorActionApi(programId, cirCourseId, data))
    props.updateGoals(false);
  };

  return (
    <div>
      <div className="col-12 p-0">
        <div className="form-group">
          <Editor
            name="guideline"
            value={guideline}
            init={{
              selector: "textarea#myTextArea",
              height: 300,

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
            onEditorChange={handleEditorChange}
          />
        </div>
        <Button className='mr-3' onClick={() => hideEditor(true)} type="primary">
          Update
        </Button>
        <Button onClick={() => hideEditor(false)} type="primary">
          Cancel
        </Button>
      </div>
    </div>
  );
}