import React, { useState, useEffect } from "react";
import { Select, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { editCourseOutlineEditorActionApi, getLecturerListActionApi } from "../../../../../../../actions/api-actions/ProgramAction";
import parse from "react-html-parser";

const { Option } = Select;

export default function OutlineLecturers() {
  const dispatch = useDispatch();

  const { selectedFolw, lecturersFromCourseOutline, courseOutlineInfo } = useSelector(
    (state) => state.GeneralProgramReducer
  );

  let currentLecturers = courseOutlineInfo?.data.teachingStaff ? courseOutlineInfo?.data.teachingStaff : ''
 
  const [lecturers, setLecturers] = useState([]);

  useEffect(() => {
    dispatch(getLecturerListActionApi(1, 1000));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderLecturers = () => {
    return lecturersFromCourseOutline?.data?.map((lecturer, idx) => {
      return (
        <Option title={lecturer.name} key={`${lecturer.id} - ${lecturer.name}`}>
          {lecturer.id} - {lecturer.name} - {lecturer.faculty}
        </Option>
      );
    });
  };

  const renderSelectedLecturers = () => {
    return lecturers.map((lect, idx) => {
      return (
        <p key={idx}>
          {lect}
        </p>
      );
    });
  };

  const onChangeSelectLecturers = (value) => {
    document.getElementById('current-lecturers').style.display = 'none'
    setLecturers(value);
  }

  const showCurrentLecturers = () => {
    document.getElementById('current-lecturers').style.display = 'block'
    setLecturers([]);
  }

  const saveNewLecturers = () => {
    if(!lecturers.length) return
    let contentHTML = document.getElementById('content-lecturers').innerHTML
    let data = {teachingStaff: contentHTML}

    dispatch(editCourseOutlineEditorActionApi(selectedFolw.programId, selectedFolw.cirCourseId, data))
  }

  return (
    <div>
      <Select
        mode="multiple"
        size="default"
        placeholder="Please select"
        defaultValue={lecturers}
        value={lecturers}
        onChange={(value) => onChangeSelectLecturers(value)}
        style={{ width: "100%" }}
        className="general-select-ant mb-4"
        filterOption={(keyword, option) =>
          option.children
            .toString()
            .toLowerCase()
            .includes(keyword.toLowerCase())
        }
      >
        {renderLecturers()}
      </Select>
      {/* <div className="wrapper-lecturer">{renderSelectedLecturers()}</div> */}
      <div className="card border-info mb-3" style={{ width: "100%" }}>
        <div className="card-header">List lecturer</div>
        <div id='content-lecturers' className="card-body text-info">
          <span id="current-lecturers">{parse(currentLecturers)}</span>
          {renderSelectedLecturers()}
        </div>
      </div>
      <Button onClick={() => saveNewLecturers()} type="primary mr-4">Save</Button>
      <Button onClick={() => showCurrentLecturers()} type="primary">Cancel</Button>
    </div>
  );
}
