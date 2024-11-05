import React, { useState } from "react";
import { useSelector } from "react-redux";
import parse from "react-html-parser";
import FormMaterials from "./form-outline/FormMaterials";
import { Button } from "antd";


export default function OutlineMaterials() {
  const { courseOutlineInfo } = useSelector(
    (state) => state.GeneralProgramReducer
  );

  let { material } = courseOutlineInfo?.data;

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
        <div className='mb-2'>
          <FormMaterials updateGoals={() => hideEditor()} />
        </div>
      ) : (
        <div className='mb-2'>
          <div className="mb-3">{parse(material)}</div>
          <Button onClick={() => showEditor()} type="primary">
            Edit
          </Button>
        </div>
      )}
    </div>
  );
}
