import React, { useState } from "react";
import { useSelector } from "react-redux";
import parse from "react-html-parser";
import FormStudy from "./form-outline/FormStudy";
import { Button } from "antd";

export default function OutlineStudy() {
  const { courseOutlineInfo } = useSelector(
    (state) => state.GeneralProgramReducer
  );

  const [isEdit, setEdit] = useState(false);

  let guideline = ((courseOutlineInfo || {}).data || {}).guideline;

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
          <FormStudy updateGoals={() => hideEditor()} />
        </div>
      ) : (
        <div className='mb-2'>
          <div className="mb-3">{parse(guideline)}</div>
          <Button onClick={() => showEditor()} type="primary">
            Edit
          </Button>
        </div>
      )}
    </div>
  );
}
