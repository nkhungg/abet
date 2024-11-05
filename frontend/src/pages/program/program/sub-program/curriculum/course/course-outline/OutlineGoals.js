import React, { useState } from "react";
import parse from "react-html-parser";
import { useSelector } from "react-redux";
import FormGoals from "./form-outline/FormGoals";
import { Button } from "antd";

export default function OutlineGoals() {
  const { courseOutlineInfo } = useSelector(
    (state) => state.GeneralProgramReducer
  );
  const [isEdit, setEdit] = useState(false);

  let { courseGoal } = courseOutlineInfo?.data;

  const showEditor = () => {
    setEdit(true);
  };

  const hideEditor = (isEdit) => {
    setEdit(isEdit);
  };

  return (
    <div>
      {isEdit ? (
        <div className='mb-2'>
          <FormGoals updateGoals={() => hideEditor()} />
        </div>
      ) : (
        <div className='mb-2'>
          <div className="mb-3">{parse(courseGoal)}</div>
          <Button onClick={() => showEditor()} type="primary">
            Edit
          </Button>
        </div>
      )}
    </div>
  );
}
