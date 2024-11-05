import React, { useState, useEffect } from "react";
import { Table, Input, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { FormattedMessage } from "react-intl";
import { Popconfirm } from 'antd';
import { deleteVersionFoundationTestSubjectActionApi, getVersionFoundationTestSubjectActionApi } from "../../../../../actions/api-actions/ProgramAction";
import { ADD_INFO_COURSE_DRAWER } from "../../../../../redux/types";
import FormVersionFoundationTestSubject from "../../../../../components/form-version-foundation-test-subject/FormVersionFoundationTestSubject";
import { SearchOutlined } from "@ant-design/icons";
import DropdownSort2 from "../../../../../components/dropdown-sort/DropdownSort2";

export default function ClassStudent() {
  const [isAscending, setAscending] = useState(true)
  const [defaultSort, setDefaultSort] = useState('subjectName')
  const sortList = ['subjectName']
  const [searchedObj, setSearchedObj] = useState([])
  const { selectedFlowProgramVersion, versionFoundationTestSubjects } = useSelector(
    (state) => state.GeneralProgramReducer
  );

  const { programVersionInfo } = selectedFlowProgramVersion;

  const dispatch = useDispatch();
  useEffect(() => {
    if(programVersionInfo) {
      dispatch(getVersionFoundationTestSubjectActionApi(programVersionInfo, 1, 500, []));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [programVersionInfo]);

  const handleSearch = () => {
    if(programVersionInfo) {
      dispatch(getVersionFoundationTestSubjectActionApi(programVersionInfo, 1, 500, searchedObj));
    }
  }

  const handleReset = (dataIndex, clearFilters) => {
    clearFilters();
    let searchedObjUpdate = searchedObj.filter(item => item.key !== dataIndex)
    setSearchedObj(searchedObjUpdate)
    if(programVersionInfo) {
      dispatch(getVersionFoundationTestSubjectActionApi(programVersionInfo, 1, 500, searchedObj));
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
    if(programVersionInfo) {
      dispatch(getVersionFoundationTestSubjectActionApi(programVersionInfo, 1, 500, []));
    }
    setSearchedObj([])
    setDefaultSort('subjectName')
    setAscending(true)
  }

  const data = versionFoundationTestSubjects?.data?.map((genPro, idx) => {
    return {
      ...genPro,
      key: idx + 1,
    };
  });

  const confirm = (subject) => {
    dispatch(deleteVersionFoundationTestSubjectActionApi(subject))
  }

  const columns = [
    {
      title: "STT",
      dataIndex: "key",
      key: "key",
      fixed: "left",
      width: "100px",
    },
    {
      title: "Subject Name",
      dataIndex: "subjectName",
      key: "subjectName",
      fixed: "left",
      ...getColumnSearchProps("subjectName"),
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
      <div className="d-flex justify-content-between align-items-center">
      <h5 className="mb-0">
        <FormattedMessage id="SUBJECTS" />
      </h5>
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
                title: "ADD NEW SUBJECTS",
                Component: <FormVersionFoundationTestSubject />,
                width: 750,
              };
              dispatch(action);
            }}
            className="icon mr-3"
          >
            <i className="fa fa-plus"></i>
          </span>
          {/* <span className="icon mr-3">
            <i className="fa fa-columns"></i>
          </span> */}
          <span title="Refresh page" onClick={() => clearAllSearch() }  className="icon mr-3">
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

    </div>
  );
}
