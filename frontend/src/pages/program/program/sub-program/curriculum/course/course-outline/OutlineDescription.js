import React, { useState } from "react";
import { useSelector } from "react-redux";
import parse from "react-html-parser";
import { Button } from "antd";
import FormOLDescription from "./form-outline/FormOLDescription";

export default function OutlineDescription() {
  const { courseOutlineInfo } = useSelector(
    (state) => state.GeneralProgramReducer
  );

  const [isEdit, setEdit] = useState(false);

  let { description } = courseOutlineInfo?.data;

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
          <FormOLDescription updateGoals={() => hideEditor()} />
        </div>
      ) : (
        <div className="mb-2">
          <div className="mb-3">{parse(description)}</div>
          <Button onClick={() => showEditor()} type="primary">
            Edit
          </Button>
        </div>
      )}
    </div>
  );
}
