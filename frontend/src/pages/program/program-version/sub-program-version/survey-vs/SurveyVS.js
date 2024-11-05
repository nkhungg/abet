import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Pagination, Menu, Dropdown, Button, Input } from "antd";
import { FormattedMessage } from "react-intl";
import { NavLink } from "react-router-dom";
import {
  ADD_INFO_COURSE_DRAWER,
  SET_EDIT_VERSION_SURVEY,
  SET_PROGRAM_VERSION_INFO_FROM_SURVEY_OUTSIDE,
} from "../../../../../redux/types";
import { editVersionSurveyActionApi, getVersionSurveyActionApi } from "../../../../../actions/api-actions/ProgramAction";
import { Switch } from "antd";
import FormVersionSurvey from "../../../../../components/form-version-survey/FormVersionSurvey";
import actions from '../../../../../asset/images/actions.png'
import { SearchOutlined } from "@ant-design/icons";
import DropdownSort2 from "../../../../../components/dropdown-sort/DropdownSort2";

export default function SurveyVS() {
  const [isAscending, setAscending] = useState(true)
  const [defaultSort, setDefaultSort] = useState('name')
  const sortList = ['name', 'description', 'surveyKindName', 'surveyTypeName']
  const [searchedObj, setSearchedObj] = useState([])
  const [page, setPage] = useState(1);
  const { versionSurvey, selectedFlowProgramVersion } = useSelector(
    (state) => state.GeneralProgramReducer
  );
  const dispatch = useDispatch();
  const { programVersionInfo } = selectedFlowProgramVersion;

  useEffect(() => {
    if(programVersionInfo) {
      dispatch(getVersionSurveyActionApi(programVersionInfo, 1, []));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [programVersionInfo]);

  const onChange = async (page) => {
    setPage(page);
    if(programVersionInfo) {
      dispatch(getVersionSurveyActionApi(programVersionInfo, page, searchedObj));
    }
  };

  const handleSearch = () => {
    if(programVersionInfo) {
      dispatch(getVersionSurveyActionApi(programVersionInfo, page, searchedObj));
    }
  }

  const handleReset = (dataIndex, clearFilters) => {
    clearFilters();
    let searchedObjUpdate = searchedObj.filter(item => item.key !== dataIndex)
    setSearchedObj(searchedObjUpdate)
    if(programVersionInfo) {
      dispatch(getVersionSurveyActionApi(programVersionInfo, page, searchedObjUpdate));
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
      dispatch(getVersionSurveyActionApi(programVersionInfo, 1, []));
    }
    setSearchedObj([])
    setPage(1)
    setDefaultSort('name')
    setAscending(true)
  }

  const onChangeLock = (checked, record) => {
    let data = {...record, lock: checked, programVersionInfo}
    dispatch(editVersionSurveyActionApi(data));
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
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "250px",
      fixed: "left",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: "250px",
      ...getColumnSearchProps("description"),
    },
    {
      title: "Kind ",
      dataIndex: "surveyKindName",
      key: "surveyKindName",
      width: "200px",
      ...getColumnSearchProps("surveyKindName"),
    },
    {
      title: "Type ",
      dataIndex: "surveyTypeName",
      key: "surveyTypeName",
      width: "200px",
      ...getColumnSearchProps("surveyTypeName"),
    },
    {
      title: "Lock ",
      key: "lock",
      width: "100px",
      render: (record) => (
        <Switch
          checked={record.lock}
          onChange={(e) => {
            onChangeLock(e, record);
          }}
        />
      ),
    },
    {
      title: "Action",
      key: "operation",
      render: (record) => (
        <span className="d-flex justify-content-center align-items-center">
          {record.lock && (
            <span
              className="btn-edit mr-3"
              style={{ color: "#929292", cursor: 'not-allowed' }}
            >
              <i className="fa fa-edit"></i>
            </span>
          )}
          {!record.lock && (
            <span
              onClick={() => {
                const action1 = {
                  type: ADD_INFO_COURSE_DRAWER,
                  title: "EDIT SURVEY",
                  Component: <FormVersionSurvey />,
                };

                //dispatch lên reducer nội dung drawer
                dispatch(action1);
                const action2 = {
                  type: SET_EDIT_VERSION_SURVEY,
                  payload: { ...record, isEdit: true },
                };
                dispatch(action2);
                //dispatch dữ liệu dòng hiện tai lên reducer
              }}
              className="btn-edit mr-3"
              style={{ color: "#929292", cursor: 'pointer' }}
            >
              <i className="fa fa-edit"></i>
            </span>
          )}
          <Dropdown
              overlay={
                <Menu>
                  <Menu.Item
                    onClick={() => {
                      dispatch({
                        type: SET_PROGRAM_VERSION_INFO_FROM_SURVEY_OUTSIDE,
                        payload: record,
                      });
                    }}
                    key="1"
                  >
                    <NavLink
                      to={`/program-version/${record.programVersionInfo}/survey/${record.name}/questions`} 
                    >
                      View Question
                    </NavLink>
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => {
                      dispatch({
                        type: SET_PROGRAM_VERSION_INFO_FROM_SURVEY_OUTSIDE,
                        payload: record,
                      });
                    }}
                    key="2"
                  >
                    <NavLink
                      to={`/program-version/${record.programVersionInfo}/survey/${record.name}-${record.type}/result`} 
                    >
                      View Result
                    </NavLink>
                  </Menu.Item>
                </Menu>
              }
              placement="topLeft"
            >
            <img
                className="mt-1 actions"
                src={actions}
                alt="action"
                width="20"
                height="20"
              />
          </Dropdown>
        </span>
      ),
      width: "80px",
      fixed: "right",
    },
  ];

  const data = versionSurvey?.data?.map((outcomeParent, idx) => {
    return { ...outcomeParent, key: (page - 1) * 10 + idx + 1 };
  });

  return (
    <div className="wrapper-outcome">
      <h5 className="mb-0">
        <FormattedMessage id="SURVEY" />
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
                title: "ADD NEW SURVEY",
                Component: <FormVersionSurvey />,
              };
              dispatch(action);
              const action2 = {
                type: SET_EDIT_VERSION_SURVEY,
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
        dataSource={data}
      />

      <div className="d-flex justify-content-center my-3">
        <Pagination
          current={page}
          total={versionSurvey.total}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
