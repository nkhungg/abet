import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Input, Button, Pagination, Menu, Dropdown } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { FormattedMessage } from "react-intl";
import { Typography } from "antd";
import { NavLink } from "react-router-dom";
import actions from "../../../../../../asset/images/actions.png";
import {
  ADD_INFO_COURSE_DRAWER,
  SET_EDIT_VERSION_COURSE_INSTANCE_TEST,
  SET_VERSION_COURSE_INSTANCE_TEST_ID,
} from "../../../../../../redux/types";
import {
    getVersionCourseInstanceTestActionApi,
} from "../../../../../../actions/api-actions/ProgramAction";
import FormVersionCourseInstanceTest from "../../../../../../components/form-version-course-instance-test/FormVersionCourseInstanceTest";
import DropdownSort2 from "../../../../../../components/dropdown-sort/DropdownSort2";
const { Paragraph } = Typography;

export default function VersionCourseTest() {
  const [isAscending, setAscending] = useState(true)
  const [defaultSort, setDefaultSort] = useState('name')
  const sortList = ['name', 'percent']
  const [searchedObj, setSearchedObj] = useState([])
  const [page, setPage] = useState(1);

  const {
    selectedFlowProgramVersion,
    versionCourseIntanceTest,
  } = useSelector((state) => state.GeneralProgramReducer);
  const {
    programVersionInfo,
    courseId,
    programVersionId,
  } = selectedFlowProgramVersion;

  const dispatch = useDispatch();

  useEffect(() => {
    if(programVersionInfo && courseId) {
      dispatch(
        getVersionCourseInstanceTestActionApi(programVersionInfo, courseId, 1, []));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [programVersionInfo, courseId]);

  const onChange = (page) => {
    setPage(page);
    if(programVersionInfo && courseId) {
      dispatch(
      getVersionCourseInstanceTestActionApi(programVersionInfo, courseId, page, searchedObj));
    }
  };

  const handleSearch = () => {
    if(programVersionInfo && courseId) {
      dispatch(
        getVersionCourseInstanceTestActionApi(programVersionInfo, courseId, page, searchedObj));
    }
  }
  
  const handleReset = (dataIndex, clearFilters) => {
    clearFilters();
    let searchedObjUpdate = searchedObj.filter(item => item.key !== dataIndex)
    setSearchedObj(searchedObjUpdate)
    if(programVersionInfo && courseId) {
      dispatch(
        getVersionCourseInstanceTestActionApi(programVersionInfo, courseId, page, searchedObjUpdate));
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
    if(programVersionInfo && courseId) {
      dispatch(
        getVersionCourseInstanceTestActionApi(programVersionInfo, courseId, 1, []));
    } 
    setSearchedObj([])
    setPage(1)
    setDefaultSort('name')
    setAscending(true)
  }

  const data = versionCourseIntanceTest?.data?.map(
    (courseOutcome, idx) => {
      return {
        ...courseOutcome,
        key: (page - 1) * 10 + idx + 1,
        programId: programVersionId,
      };
    }
  );

  const columns = [
    {
      title: "Stt",
      dataIndex: "key",
      key: "key",
      width: "60px",
      fixed: "left",
    },
    {
      title: "Test Name",
      dataIndex: "name",
      key: "name",
      width: "250px",
      fixed: "left",
      ...getColumnSearchProps("name"),
    },

    {
      title: "Percent",
      dataIndex: "percent",
      key: "percent",
      ...getColumnSearchProps("percent"),
      render: (text) => (
        <Paragraph ellipsis={{ rows: 2, expandable: true, symbol: "more" }}>
          {text}
        </Paragraph>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: "100px",
      fixed: "right",
      render: (text, record, index) => {
        return (
          <span className="d-flex justify-content-center align-items-center">
            <span
              className="btn-edit mr-3"
              onClick={() => {
                const action1 = {
                  type: ADD_INFO_COURSE_DRAWER,
                  title: "EDIT TEST",
                  Component: <FormVersionCourseInstanceTest />,
                };

                //dispatch lên reducer nội dung drawer
                dispatch(action1);
                //dispatch dữ liệu dòng hiện tai lên reducer
                const action2 = {
                  type: SET_EDIT_VERSION_COURSE_INSTANCE_TEST,
                  payload: { ...record, isEdit: true },
                };
                dispatch(action2);
              }}
            >
              <i className="fa fa-edit"></i>
            </span>
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item
                    key="1"
                    onClick={() => {
                      dispatch({
                        type: SET_VERSION_COURSE_INSTANCE_TEST_ID,
                        payload: record,
                      });
                    }}
                  >
                    <NavLink
                      to={`/program-version/${programVersionInfo}/course-instances/${courseId}/test/${record.id}/course-outcome`}
                    >
                      View Test Course Outcome
                    </NavLink>
                  </Menu.Item>
                  <Menu.Item
                    key="2"
                    onClick={() => {
                      dispatch({
                        type: SET_VERSION_COURSE_INSTANCE_TEST_ID,
                        payload: record,
                      });
                    }}
                  >
                    <NavLink
                      to={`/program-version/${programVersionInfo}/course-instances/${courseId}/test/${record.id}/question`}
                    >
                      View Questions
                    </NavLink>
                  </Menu.Item>
                  <Menu.Item
                    key="3"
                    onClick={() => {
                      dispatch({
                        type: SET_VERSION_COURSE_INSTANCE_TEST_ID,
                        payload: record,
                      });
                    }}
                  >
                    <NavLink
                      to={`/program-version/${programVersionInfo}/course-instances/${courseId}/test/${record.id}/result`}
                    >
                      View Results
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
        );
      },
    },
  ];

  return (
    <div className="mt-2 outcomes">
      <div className="d-flex justify-content-start align-items-center">
        <h5 className="mb-0 mr-5">
          <FormattedMessage id="TEST" />
        </h5>
      </div>

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
                title: "ADD NEW TEST",
                Component: <FormVersionCourseInstanceTest />,
              };
              dispatch(action);
              const action2 = {
                type: SET_EDIT_VERSION_COURSE_INSTANCE_TEST,
                payload: {
                  isEdit: false,
                },
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

      <div className="d-flex justify-content-center my-3">
        <Pagination
          current={page}
          total={versionCourseIntanceTest.total}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
