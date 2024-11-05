import React, { useState, useEffect } from "react";
import { Select, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import parse from "react-html-parser";
import { editCourseInstanceOutlineActionApi, getLecturerListActionApi } from "../../../../../../actions/api-actions/ProgramAction";

const { Option } = Select;

export default function OutlineLecturersInstance() {
  const dispatch = useDispatch();

  const {
    selectedFlowProgramVersion,
    lecturersFromCourseOutline,
    courseInstanceOutline,
  } = useSelector((state) => state.GeneralProgramReducer);

  const { programVersionInfo, courseId } = selectedFlowProgramVersion;

  let currentLecturers = courseInstanceOutline?.data.teachingStaff
    ? courseInstanceOutline?.data.teachingStaff
    : "";

  const [lecturers, setLecturers] = useState([]);

  useEffect(() => {
    dispatch(getLecturerListActionApi(1, 1000));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderLecturers = () => {
    return lecturersFromCourseOutline?.data?.map((lecturer, idx) => {
      return (
        <Option title={lecturer.name} key={`${lecturer.id} - ${lecturer.name}`}>
          {lecturer.id} - {lecturer.name}
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
    document.getElementById("current-lecturers").style.display = "none";
    setLecturers(value);
  };

  const showCurrentLecturers = () => {
    document.getElementById("current-lecturers").style.display = "block";
    setLecturers([]);
  };

  const saveNewLecturers = () => {
    if (!lecturers.length) return;
    let contentHTML = document.getElementById("content-lecturers").innerHTML;
    let data = { teachingStaff: contentHTML };

    dispatch(editCourseInstanceOutlineActionApi(programVersionInfo, courseId, data));
  };

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
        <div id="content-lecturers" className="card-body text-info">
          <span id="current-lecturers">{parse(currentLecturers)}</span>
          {renderSelectedLecturers()}
        </div>
      </div>
      <Button onClick={() => saveNewLecturers()} type="primary mr-4">
        Save
      </Button>
      <Button onClick={() => showCurrentLecturers()} type="primary">
        Cancel
      </Button>
    </div>
  );
}
