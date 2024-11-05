import React, { useState, useEffect } from "react";
import { Table, Input, Button, Pagination } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { SearchOutlined } from "@ant-design/icons";
import { FormattedMessage } from "react-intl";
import {
  ADD_INFO_COURSE_DRAWER,
  GET_SEARCH_STUDENTS,
  SET_EDIT_VERSION_CLASS_ASSESSMENT,
} from "../../../../../../../redux/types";
import FormVersionClassStudent from "../../../../../../../components/form-version-class-student/FormVersionClassStudent";
import { deleteVersionClassStudentActionApi, getAllStudentsActionApi, getVersionClassStudentActionApi } from "../../../../../../../actions/api-actions/ProgramAction";
import { Popconfirm } from 'antd';
import DropdownSort2 from "../../../../../../../components/dropdown-sort/DropdownSort2";

export default function ClassStudent() {
  const [isAscending, setAscending] = useState(true)
  const [defaultSort, setDefaultSort] = useState('studentId')
  const sortList = ['studentId', 'name', 'major', 'year', 'email']
  const [searchedObj, setSearchedObj] = useState([])
  const [page, setPage] = useState(1);
  const { selectedFlowProgramVersion, versionClassStudent, allStudent } = useSelector(
    (state) => state.GeneralProgramReducer
  );

  const { courseId, classId } = selectedFlowProgramVersion;

  const dispatch = useDispatch();
  useEffect(() => {
    if(courseId && classId) {
      dispatch(getAllStudentsActionApi(1, 2000));
      dispatch(getVersionClassStudentActionApi(courseId, classId, 1, []));
      dispatch({
        type: GET_SEARCH_STUDENTS,
        payload: allStudent
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, classId]);

  const onChange = (page) => {
    setPage(page);
    if(courseId && classId) {
      dispatch(getVersionClassStudentActionApi(courseId, classId, page, searchedObj));
    }
  };

  const handleSearch = () => {
    if(courseId && classId) {
      dispatch(getVersionClassStudentActionApi(courseId, classId, page, searchedObj));
    }
  }

  const handleReset = (dataIndex, clearFilters) => {
    clearFilters();
    let searchedObjUpdate = searchedObj.filter(item => item.key !== dataIndex)
    setSearchedObj(searchedObjUpdate)
    if(courseId && classId) {
      dispatch(getVersionClassStudentActionApi(courseId, classId, page, searchedObjUpdate));
    }
  }

  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div className='d-flex justify-content-between align-items-center p-3'>
        <Input
          className='mr-3'
          value={selectedKeys[0]}
          onChange={e => {
            setSelectedKeys(e.target.value ? [e.target.value] : [])
            let newSearchArray = updateSearchObj(dataIndex, e.target.value, [...searchedObj])
            setSearchedObj(newSearchArray)
          }}
          onPressEnter={() => handleSearch()}
        />
        <span onClick={() => handleReset(dataIndex, clearFilters)} size="small" style={{ width: 38, cursor: 'pointer' }}>
        Reset
        </span>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
  });

  const updateSearchObj = (dataIndex, val, searchedObjUpdate) => {
    let idx = searchedObj.findIndex(item => item.key === dataIndex)
    if (idx < 0) {
      let obj = {
        key: dataIndex,
        val: val
      }
      searchedObjUpdate.push(obj)
    } else {
      searchedObjUpdate[idx].val = val
    }
    return searchedObjUpdate
  }

  const updateSortBy = (value) => {
    let newSearchArraysortBy = updateSearchObj('sortBy', value, [...searchedObj])
    newSearchArraysortBy = updateSearchObj('orderBy', isAscending ? 'asc' : 'desc', newSearchArraysortBy)
    setSearchedObj(newSearchArraysortBy)
  }

  const updateDefaultCheck = (sortField) => {
    setDefaultSort(sortField)
  }

  const updateAscending = (hasAscending) => {
    setAscending(hasAscending)
    let newSearchArraysortBy = updateSearchObj('orderBy', hasAscending ? 'asc' : 'desc', searchedObj)
    setSearchedObj(newSearchArraysortBy)
  }

  const clearAllSearch = () => {
    setPage(1)
    if(courseId && classId) {
      dispatch(getVersionClassStudentActionApi(courseId, classId, 1, []));
    }
    setSearchedObj([])
    setDefaultSort('studentId')
    setAscending(true)
  }

  const data = versionClassStudent?.data?.map((genPro, idx) => {
    return {
      ...genPro,
      key: (page - 1) * 10 + idx + 1,
    };
  });

  const confirm = (student) => {
    let studentUpdate = {...student, courseId, classId }
    dispatch(deleteVersionClassStudentActionApi(studentUpdate))
  }

  const columns = [
    {
      title: "STT",
      dataIndex: "key",
      key: "key",
      fixed: "left",
      width: "60px",
    },
    {
      title: "Student code",
      dataIndex: "studentId",
      key: "studentId",
      fixed: "left",
      width: "150px",
      ...getColumnSearchProps("studentId"),
    },
    {
      title: "Student name",
      dataIndex: "name",
      key: "name",
      width: "250px",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Major",
      dataIndex: "major",
      key: "major",
      width: "250px",
      ...getColumnSearchProps("major"),
    },
    {
      title: "Year",
      dataIndex: "year",
      width: "130px",
      key: "year",
      ...getColumnSearchProps("year"),
    },
    {
      title: "Email",
      dataIndex: "email",
      width: "200px",
      key: "email",
      ...getColumnSearchProps("email"),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      fixed: "right",
      width: "80px",
      render: (text, record, index) => {
        return (
          <span className="d-flex justify-content-center align-items-center">
            <Popconfirm
              placement="topLeft"
              title='Are you sure to delete this task?'
              okText="Yes"
              cancelText="No"
              onConfirm={() => confirm(record)}
            >
              {/* <span className="btn-edit mr-3"> */}
                <i className="btn-edit fa fa-trash-alt"></i>
              {/* </span> */}
            </Popconfirm>
          </span>
        );
      },
    },
  ];

  return (
    <div className="mt-2 general-program">
      <h5 className="mb-0">
        <FormattedMessage id="STUDENT" />
      </h5>

      <div className="mb-3 d-flex justify-content-end align-items-center">
       
        <div className="d-flex justify-content-center align-items-center wrapper-icon">
        <DropdownSort2  
            isAscending={isAscending}
            updateAscending={updateAscending}
            defaultSort={defaultSort} 
            sortList={sortList} 
            updateSort={updateSortBy} 
            updateDefaultSort={updateDefaultCheck} 
          />
          <span className="icon" onClick={() => handleSearch()}><i className="fa fa-filter mx-3"></i></span>
          <span
            onClick={() => {
              let action = {
                type: ADD_INFO_COURSE_DRAWER,
                title: "ADD NEW CLASS STUDENT",
                Component: <FormVersionClassStudent />,
                width: 750,
              };
              dispatch(action);
              const action2 = {
                type: SET_EDIT_VERSION_CLASS_ASSESSMENT,
                payload: { isEdit: false },
              };
              dispatch(action2);
            }}
            className="icon mr-3"
          >
            <i className="fa fa-plus"></i>
          </span>
          {/* <span className="icon mr-3">
            <i className="fa fa-columns"></i>
          </span> */}
          <span title="Refresh page" onClick={() => clearAllSearch() } className="icon mr-3">
            <i className="fa fa-sync-alt"></i>
          </span>
          <span className="icon mr-3">
            <i className="fa fa-download"></i>
          </span>
        
        </div>
      </div>
      <Table
        scroll={{ x: 992 }}
        pagination={false}
        columns={columns}
        dataSource={data}
      />

      <div className="d-flex justify-content-center my-3">
        <Pagination
          current={page}
          total={versionClassStudent.total}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
