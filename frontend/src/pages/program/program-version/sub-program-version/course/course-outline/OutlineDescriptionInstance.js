import React, { useState } from "react";
import { useSelector } from "react-redux";
import parse from "react-html-parser";
import { Button } from "antd";
import FormOLDescriptionInstance from './form-outline-instance/FormOLDescriptionInstance'

export default function OutlineDescriptionInstance() {
    const { courseInstanceOutline } = useSelector(
        (state) => state.GeneralProgramReducer
      );
    
      const [isEdit, setEdit] = useState(false);
    
      let { description } = courseInstanceOutline?.data;
    
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
          <FormOLDescriptionInstance updateGoals={() => hideEditor()} />
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
    )
}