import { Editor } from "@tinymce/tinymce-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "antd";
import { editCourseInstanceOutlineActionApi } from "../../../../../../../actions/api-actions/ProgramAction";

export default function FormMaterialsInstance(props) {
  const { selectedFlowProgramVersion, courseInstanceOutline } = useSelector(
    (state) => state.GeneralProgramReducer
  );
  const { programVersionInfo, courseId } = selectedFlowProgramVersion
  let materialJSX = courseInstanceOutline?.data?.material;

  const dispatch = useDispatch();
  const [material, setMaterial] = useState(materialJSX);

  const handleEditorChange = (content, editor) => {
    setMaterial(content);
  };

  const hideEditor = async (isUpdate) => {
    let data = { material: isUpdate ? material : materialJSX };
    await dispatch(editCourseInstanceOutlineActionApi(programVersionInfo, courseId, data));
    props.updateGoals(false);
  };

  return (
    <div>
      <div className="col-12 p-0">
        <div className="form-group">
          <Editor
            name="material"
            value={material}
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
        <Button
          className="mr-3"
          onClick={() => hideEditor(true)}
          type="primary"
        >
          Update
        </Button>
        <Button onClick={() => hideEditor(false)} type="primary">
          Cancel
        </Button>
      </div>
    </div>
  );
}