import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Editor } from "@tinymce/tinymce-react";
import { Button } from "antd";
import { editCourseOutlineEditorActionApi } from "../../../../../../../../actions/api-actions/ProgramAction";

export default function FormGoals(props) {
  
  const { selectedFolw, courseOutlineInfo } = useSelector((state) => state.GeneralProgramReducer);
  let courseGoalJSX = courseOutlineInfo?.data?.courseGoal

  const dispatch = useDispatch();
  const [courseGoal, setCourseGoal] = useState(courseGoalJSX);

  const handleEditorChange = (content, editor) => {
    setCourseGoal(content)
  };

  const hideEditor = async (isUpdate) => {
    let data = {courseGoal: isUpdate ? courseGoal : courseGoalJSX}
    await dispatch(editCourseOutlineEditorActionApi(selectedFolw.programId, selectedFolw.cirCourseId, data))
    props.updateGoals(false);
  };

  return (
    <div>
      <form className="col-12 p-0">
        <div className="form-group">
          <Editor
            name="courseGoal"
            value={courseGoal}
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
      </form>
    </div>
  );
}


