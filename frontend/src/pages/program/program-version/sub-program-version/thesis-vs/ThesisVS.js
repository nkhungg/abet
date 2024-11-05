import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Input, Pagination, Button, } from "antd";
import { FormattedMessage } from "react-intl";
import {
  ADD_INFO_COURSE_DRAWER,
  SET_EDIT_VERSION_THESIS,
  SET_EDIT_VERSION_THESIS_LECTURER,
} from "../../../../../redux/types";
import FormVersionThesis from "../../../../../components/form-version-thesis/FormVersionThesis";
import FormVersionThesisLecturer from "../../../../../components/form-version-thesis-lecturer/FormVersionThesisLecturer";
import { getVersionThesisActionApi } from "../../../../../actions/api-actions/ProgramAction";
import { SearchOutlined } from "@ant-design/icons";
import DropdownSort2 from "../../../../../components/dropdown-sort/DropdownSort2";

export default function ThesisVS() {
  const [isAscending, setAscending] = useState(true)
  const [defaultSort, setDefaultSort] = useState('projectName')
  const sortList = ['projectName', 'reviewerName', 'council']
  const [searchedObj, setSearchedObj] = useState([])
  const [page, setPage] = useState(1);
  const { versionThesis, selectedFlowProgramVersion } = useSelector(
    (state) => state.GeneralProgramReducer
  );
  const dispatch = useDispatch();
  const { programVersionInfo } = selectedFlowProgramVersion;

  useEffect(() => {
    if(programVersionInfo) {
      dispatch(getVersionThesisActionApi(programVersionInfo, 1, []))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [programVersionInfo]);

  const onChange = async (page) => {
    setPage(page)
    if(programVersionInfo) {
      dispatch(getVersionThesisActionApi(programVersionInfo, page))
    }
  };

  const handleSearch = () => {
    if(programVersionInfo) {
      dispatch(getVersionThesisActionApi(programVersionInfo, page, searchedObj))
    }
  }

  const handleReset = (dataIndex, clearFilters) => {
    clearFilters();
    let searchedObjUpdate = searchedObj.filter(item => item.key !== dataIndex)
    setSearchedObj(searchedObjUpdate)
    if(programVersionInfo) {
      dispatch(getVersionThesisActionApi(programVersionInfo, page, searchedObjUpdate))
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
      dispatch(getVersionThesisActionApi(programVersionInfo, 1, []))
    }
    setSearchedObj([])
    setPage(1)
    setDefaultSort('projectName')
    setAscending(true)
  }

  const expandedRowRender = (record) => {
    const columns = [
      {
        title: "STT",
        dataIndex: "key",
        key: "key",
        width: "80px",
        fixed: "left",
      },
      {
        title: "Name",
        dataIndex: "lecturerName",
        key: "lecturerName",
      },
      {
        title: "Role",
        dataIndex: "role",
        key: "role",
      },
      {
        title: "Action",
        dataIndex: "operation",
        key: "operation",
        width: "80px",
        fixed: "right",
        render: (text, record, index) => (
          <span className="d-flex justify-content-between align-items-center">
            <span
              style={{ color: "#929292" }}
              onClick={() => {
                const action1 = {
                  type: ADD_INFO_COURSE_DRAWER,
                  title: "EDIT LECTURER",
                  Component: <FormVersionThesisLecturer />,
                };

                //dispatch lên reducer nội dung drawer
                dispatch(action1);
                const action2 = {
                  type: SET_EDIT_VERSION_THESIS_LECTURER,
                  payload: { ...record, isEdit: true },
                };
                dispatch(action2);
                //dispatch dữ liệu dòng hiện tai lên reducer
              }}
              className="btn-edit mr-3"
            >
              <i className="fa fa-edit"></i>
            </span>
          </span>
        ),
      },
    ];

    const data = record?.lecturerList?.map((lecturer, idx) => {
      return { ...lecturer, key: idx + 1 };
    });

    return (
      <Table
        className="child-test-question"
        columns={columns}
        dataSource={data}
        pagination={false}
      />
    );
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "key",
      key: "key",
      fixed: "left",
      width: "60px",
    },
    {
      title: "Project name ",
      dataIndex: "projectName",
      key: "projectName",
      width: "500px",
      fixed: "left",
      ...getColumnSearchProps("projectName"),
    },
    {
      title: "Main Lecturer",
      dataIndex: "reviewerName",
      key: "reviewerName",
      width: "250px",
      ...getColumnSearchProps("reviewerName"),
    },
    {
      title: "Council ",
      dataIndex: "council",
      key: "council",
      ...getColumnSearchProps("council"),
    },
    {
      title: "Action",
      key: "operation",
      render: (record) => (
        <span className="d-flex justify-content-between align-items-center">
          <span
            onClick={() => {
              const action1 = {
                type: ADD_INFO_COURSE_DRAWER,
                title: "EDIT THESIS",
                Component: <FormVersionThesis />,
              };

              //dispatch lên reducer nội dung drawer
              dispatch(action1);
              const action2 = {
                type: SET_EDIT_VERSION_THESIS,
                payload: { ...record, isEdit: true },
              };
              dispatch(action2);
              //dispatch dữ liệu dòng hiện tai lên reducer
            }}
            className="btn-edit mr-3"
            style={{ color: "#929292" }}
          >
            <i className="fa fa-edit"></i>
          </span>
          <span
            onClick={() => {
              const action1 = {
                type: ADD_INFO_COURSE_DRAWER,
                title: "ADD NEW LECTURER",
                Component: <FormVersionThesisLecturer />,
              };

              //dispatch lên reducer nội dung drawer
              dispatch(action1);
              const action2 = {
                type: SET_EDIT_VERSION_THESIS_LECTURER,
                payload: { projectId: record.projectId, isEdit: false },
              };
              dispatch(action2);
              //dispatch dữ liệu dòng hiện tai lên reducer
            }}
            className="btn-edit mr-3"
            style={{ color: "#929292" }}
          >
            <i className="fa fa-plus-circle"></i>
          </span>
        </span>
      ),
      width: "80px",
      fixed: "right",
    },
  ];

  const data = versionThesis?.data?.map((outcomeParent, idx) => {
    return { ...outcomeParent, key: (page -1)*10 + idx + 1 };
  });

  return (
    <div className="wrapper-outcome">
      <h5 className="mb-0">
        <FormattedMessage id="THESIS" />
      </h5>

      <div className="mb-3 d-flex justify-content-end align-items-center">
        
        <div
          className="d-flex justify-content-center align-items-center wrapper-icon"
          style={{ fontSize: "16px", color: "#66615b" }}
        >
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
                title: "ADD NEW THESIS",
                Component: <FormVersionThesis />,
              };
              dispatch(action);
              const action2 = {
                type: SET_EDIT_VERSION_THESIS,
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
        className="components-table-demo-nested"
        columns={columns}
        expandable={{ expandedRowRender }}
        dataSource={data}
      />

      <div className="d-flex justify-content-center my-3">
        <Pagination
          current={page}
          total={versionThesis.total}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
