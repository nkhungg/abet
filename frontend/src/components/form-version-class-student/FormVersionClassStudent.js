import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllStudentsActionApi,
  postVersionClassStudentActionApi,
} from "../../actions/api-actions/ProgramAction";
import "../form.scss";
import { Input, Button, Select } from "antd";
import { programService } from "../../services/ProgramService";
import { SearchOutlined } from "@ant-design/icons";
import { GET_SEARCH_STUDENTS } from "../../redux/types";

const { Option } = Select;

export default function FormVersionClassStudent() {
  const dispatch = useDispatch();
  const {
    selectedFlowProgramVersion,
    allStudent,
    searchStudents,
    versionClassStudent,
  } = useSelector((state) => state.GeneralProgramReducer);
  const { visible } = useSelector((state) => state.DrawerCourseReducer);
  const [selectIds, setSelectIds] = useState([]);
  const { courseId, classId } = selectedFlowProgramVersion;
  const [years, setYears] = useState([]);
  const [majors, setMajors] = useState([]);


  const classIdPrefix = classId.split('_').slice(0, -1).join('_');

  // state sort && search
  const [searchInfo, setSearchInfo] = useState({
    year: 0,
    major: "ALL",
    keyword: ''
  });

  useEffect(async () => {
    dispatch(getAllStudentsActionApi(1, 2000, classIdPrefix));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    try {
      let yearResult = await programService.getAllYear();
      let majorResult = await programService.getAllMajor();
      if (yearResult && yearResult.data) {
        setYears(yearResult.data.data);
      }
      if (majorResult && majorResult.data) {
        setMajors(majorResult.data.data);
      }
    } catch (err) {
      console.log("err", err);
    }
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
    let arraySelectedShow = allStudent?.data?.filter((item) =>
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
    const availableStudenIdtList = versionClassStudent?.data.map(
      (item) => item.studentId
    );
    const namesToDeleteSet = new Set(availableStudenIdtList.concat(selectIds));
    const newArr = searchStudents?.data?.filter((item) => {
      return !namesToDeleteSet.has(item.id);
    });
    return newArr;
  };

  const renderStudentList = () => {
    return calculateListShow()?.map((studentInfo, idx) => {
      return (
        <div
          onClick={() => moveToSelectedArea(studentInfo.id)}
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
            {studentInfo.id} - {studentInfo.name} - {studentInfo.major}
          </span>
        </div>
      );
    });
  };

  const renderYearOptions = () => {
    let yearAll = ['ALL', ...years]
    return yearAll?.map((year, idx) => {
      return (
        <Option key={idx} value={year}>
          {year}
        </Option>
      );
    });
  };

  const renderMajorOptions = () => {
    let majorAll = ["ALL", ...majors];
    return majorAll?.map((major, idx) => {
      if (major) {
        return (
          <Option key={idx} value={major}>
            {major}
          </Option>
        );
      }
    });
  };

  const getYear = (value) => {
    setSearchInfo({ ...searchInfo, year: value });
  };

  const getMajor = (value) => {
    if(value === 'ALL') value=''
    setSearchInfo({ ...searchInfo, major: value });
  };

  const onSearch = (value) => {
    setSearchInfo({ ...searchInfo, keyword: value});
  };

  const searchListStudent = async () => {
    let {keyword, year, major} = searchInfo
    try {
      let result = await programService.searchStudentList(keyword, String(year) === 'ALL' ? '' : year, major === 'ALL' ? '' : major)
      if(result && result.data) {
        dispatch({
          type: GET_SEARCH_STUDENTS,
          payload: result.data
        })
      }
    } catch(e) {
      console.log('err', e);
    }
  }

  const submitStudentList = () => {
    let data = { selectIds: selectIds, courseId, classId };
    dispatch(postVersionClassStudentActionApi(data));
    setSelectIds([]);
  };

  if (!visible) return null;

  return (
    <div>
      <div className="mb-3">
        <div
          className="d-flex justify-content-start align-items-center mb-1"
          style={{ marginTop: "-10px" }}
        >
          <Select
            showSearch
            style={{ width: 200, flex: 1 }}
            placeholder="Search to year"
            className="w-100 mr-3"
            optionFilterProp="children"
            onChange={(value) => getYear(value)}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {renderYearOptions()}
          </Select>
          <Select
            showSearch
            style={{ width: 200, flex: 1 }}
            placeholder="Search to major"
            className="w-100 mr-3"
            optionFilterProp="children"
            onChange={(value) => getMajor(value)}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {renderMajorOptions()}
          </Select>
          <Input
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search student infomation"
            style={{ flex: 2 }}
            className='mr-3'
          />
          <Button onClick={() => searchListStudent()} type="primary" icon={<SearchOutlined />}>
            Search
          </Button>
        </div>
      </div>
      <div className="d-flex justify-content-between align-items-center">
        {/* unselect */}
        <div className="student-checkbox-list">
          <div style={{ height: "40px" }} className="title">
            All students
          </div>
          <form className="mb-3">{renderStudentList()}</form>
          <div className="d-flex justify-content-end"></div>
        </div>
        {/* selected */}
        <div className="student-checkbox-list">
          <div
            style={{ height: "40px" }}
            className="d-flex justify-content-between align-items-center"
          >
            <p className="title">Selected students</p>
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
