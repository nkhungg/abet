import React, { useState } from "react";
import { useSelector } from "react-redux";
import parse from "react-html-parser";
import { Button } from "antd";
import FormStudyInstance from "./form-outline-instance/FormStudyInstance";

export default function OutlineStudyInstance() {
  const { courseInstanceOutline } = useSelector(
    (state) => state.GeneralProgramReducer
  );

  const [isEdit, setEdit] = useState(false);

  let { guideline } = courseInstanceOutline?.data || {};

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
          <FormStudyInstance updateGoals={() => hideEditor()} />
        </div>
      ) : (
        <div className="mb-2">
          <div className="mb-3">{parse(guideline)}</div>
          <Button onClick={() => showEditor()} type="primary">
            Edit
          </Button>
        </div>
      )}
    </div>
  );
}
