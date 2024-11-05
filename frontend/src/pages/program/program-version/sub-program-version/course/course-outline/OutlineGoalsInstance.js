import React, { useState } from "react";
import parse from "react-html-parser";
import { useSelector } from "react-redux";
import { Button } from "antd";
import FormGoalsInstance from "./form-outline-instance/FormGoalsInstance";

export default function OutlineGoalsInstance() {
  const { courseInstanceOutline } = useSelector(
    (state) => state.GeneralProgramReducer
  );
  const [isEdit, setEdit] = useState(false);

  let { courseGoal } = courseInstanceOutline?.data;

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
          <FormGoalsInstance updateGoals={() => hideEditor()} />
        </div>
      ) : (
        <div className="mb-2">
          <div className="mb-3">{parse(courseGoal)}</div>
          <Button onClick={() => showEditor()} type="primary">
            Edit
          </Button>
        </div>
      )}
    </div>
  );
}
