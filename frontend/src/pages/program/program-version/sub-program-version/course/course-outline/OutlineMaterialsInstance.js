import React, { useState } from "react";
import { useSelector } from "react-redux";
import parse from "react-html-parser";
import { Button } from "antd";
import FormMaterialsInstance from "./form-outline-instance/FormMaterialsInstance";

export default function OutlineMaterialsInstance() {
  const { courseInstanceOutline } = useSelector(
    (state) => state.GeneralProgramReducer
  );
  let { material } = courseInstanceOutline?.data;

  const [isEdit, setEdit] = useState(false);

  const showEditor = () => {
    setEdit(true);
  };

  const hideEditor = (isEdit) => {
    setEdit(isEdit);
  };

  return (
    <div>
      {isEdit ? (
        <div className="mb-2">
          <FormMaterialsInstance updateGoals={() => hideEditor()} />
        </div>
      ) : (
        <div className="mb-2">
          <div className="mb-3">{parse(material)}</div>
          <Button onClick={() => showEditor()} type="primary">
            Edit
          </Button>
        </div>
      )}
    </div>
  );
}
