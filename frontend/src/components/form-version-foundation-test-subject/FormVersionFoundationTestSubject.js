import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getSubjectsActionApi,
  postVersionFoundationTestSubjectActionApi,
} from "../../actions/api-actions/ProgramAction";
import "../form.scss";
import { Button } from "antd";

export default function FormVersionFoundationTestSubject() {
  const dispatch = useDispatch();
  const {
    selectedFlowProgramVersion,
    allSubjects,
    versionFoundationTestSubjects,
  } = useSelector((state) => state.GeneralProgramReducer);
  const { visible } = useSelector((state) => state.DrawerCourseReducer);
  const [selectIds, setSelectIds] = useState([]);
  const { programVersionInfo } = selectedFlowProgramVersion;

  useEffect(() => {
    dispatch(getSubjectsActionApi(2000, 1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const moveToSelectedArea = (id) => {
    let selectIdsUpdate = [...selectIds];
    selectIdsUpdate.push(id);
    setSelectIds(selectIdsUpdate);
  };

  const moveToUnSelectArea = (id) => {
    let selectIdsUpdate = [...selectIds];
    selectIdsUpdate = selectIdsUpdate.filter(
      (itm) => Number(itm) !== Number(id)
    );
    setSelectIds(selectIdsUpdate);
  };

  const calculateDraftSelectedList = () => {
    let arraySelectedShow = allSubjects?.data?.filter((item) =>
      selectIds.includes(item.id)
    );
    return arraySelectedShow?.map((studentInfo, idx) => {
      return (
        <div
          onClick={() => moveToUnSelectArea(studentInfo.id)}
          style={{ cursor: "pointer" }}
          className="my-2 d-flex justify-content-start align-items-center"
          key={idx}
        >
          <span style={{ fontSize: "13px" }} className="mr-3">
            {studentInfo.id} - {studentInfo.name} - {studentInfo.major}
          </span>
          <span className="icon" style={{ color: "#929292" }}>
            <i className="fa fa-times-circle"></i>
          </span>
        </div>
      );
    });
  };

  const calculateListShow = () => {
    const availableSubjectIdList = versionFoundationTestSubjects?.data.map(
      (item) => item.subjectId
    );
    const namesToDeleteSet = new Set(availableSubjectIdList.concat(selectIds));
    const newArr = allSubjects?.data?.filter((item) => {
      return !namesToDeleteSet.has(item.id);
    });
    return newArr;
  };
 
  const renderSubjectList = () => {
    return calculateListShow()?.map((subject, idx) => {
      return (
        <div
          onClick={() => moveToSelectedArea(subject.id)}
          className="my-2 d-flex justify-content-start align-items-center"
          key={idx}
          style={{ cursor: "pointer" }}
        >
          <span
            className="icon mr-3"
            style={{ color: "#929292", cursor: "pointer" }}
          >
            <i className="fa fa-plus-circle"></i>
          </span>

          <span style={{ fontSize: "13px" }}>
            {subject.name}
          </span>
        </div>
      );
    });
  };

  const submitStudentList = () => {
    let data = { selectIds: selectIds, programVersionInfo};
    dispatch(postVersionFoundationTestSubjectActionApi(data));
    setSelectIds([]);
  };

  if (!visible) return null;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        {/* unselect */}
        <div className="student-checkbox-list">
          <div style={{ height: "40px" }} className="title">
            All subjects
          </div>
          <form className="mb-3">{renderSubjectList()}</form>
          <div className="d-flex justify-content-end"></div>
        </div>
        {/* selected */}
        <div className="student-checkbox-list">
          <div
            style={{ height: "40px" }}
            className="d-flex justify-content-between align-items-center"
          >
            <p className="title">Selected subjects</p>
            <Button
              style={{ width: "100px" }}
              onClick={() => submitStudentList()}
              type="primary"
            >
              Save
            </Button>
          </div>
          <form className="mb-3">{calculateDraftSelectedList()}</form>
          <div className="d-flex justify-content-end"></div>
        </div>
      </div>
    </div>
  );
}
