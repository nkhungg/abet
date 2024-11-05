import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProgramVersionActionApi } from "../../../actions/api-actions/ProgramAction";
import { Table, Input, Button, Pagination, Menu, Dropdown } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import actions from "../../../asset/images/actions.png";
import { FormattedMessage } from "react-intl";
import { NavLink } from "react-router-dom";
import FormProgramVersion from "../../../components/form-program-version/FormProgramVersion";
import { ADD_INFO_COURSE_DRAWER, SET_EDIT_PROGRAM_VERSION, SET_PROGRAM_VERSION_ID } from "../../../redux/types";
import DropdownSort2 from "../../../components/dropdown-sort/DropdownSort2";

export default function ProgramVersion() {
  const [isAscending, setAscending] = useState(true)
  const [defaultSort, setDefaultSort] = useState('programId')
  const sortList = ['programId', 'year', 'semester']
  const [searchedObj, setSearchedObj] = useState([])
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();

  const { programVersion } = useSelector((state) => state.GeneralProgramReducer);

  useEffect(() => {
    dispatch(getProgramVersionActionApi(1, []));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChange = (page) => {
    dispatch(getProgramVersionActionApi(page, searchedObj));
    setPage(page);
  };

  const handleSearch = () => {
    dispatch(getProgramVersionActionApi(1, searchedObj));
  }

  const handleReset = (dataIndex, clearFilters) => {
    clearFilters();
    let searchedObjUpdate = searchedObj.filter(item => item.key !== dataIndex)
    setSearchedObj(searchedObjUpdate)
    dispatch(getProgramVersionActionApi(page, searchedObjUpdate));
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

  const data = programVersion?.data?.map((program, idx) => {
    return {
      ...program,
      key: (page - 1) * 10 + idx + 1
    };
  });

  const columns = [
    {
      title: "Stt",
      dataIndex: "key",
      fixed: "left",
      key: "key",
      width: "60px",
    },
    {
      title: "Program Id",
      dataIndex: "programId",
      fixed: "left",
      key: "programId",
      width: "150px",
      ...getColumnSearchProps("programId"),
    },
    {
      title: "Year",
      dataIndex: "year",
      key: "year",
      ...getColumnSearchProps("year"),
    },
    {
      title: "Semester",
      dataIndex: "semester",
      key: "semester",
      ...getColumnSearchProps("semester"),
    },
    {
      title: "Action",
      dataIndex: "action",
      fixed: "right",
      key: "action",
      width: "80px",
      render: (text, record, index) => {
        return (
          <span className="d-flex justify-content-between align-items-center">
            <span
              className="btn-edit mr-3"
              onClick={() => {
                const action1 = {
                  type: ADD_INFO_COURSE_DRAWER,
                  title: "EDIT PROGRAM VERSION",
                  Component: <FormProgramVersion />,
                };

                //dispatch lên reducer nội dung drawer
                dispatch(action1);
                //dispatch dữ liệu dòng hiện tai lên reducer
                const action2 = {
                  type: SET_EDIT_PROGRAM_VERSION,
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
                    onClick={() => {
                      dispatch({
                        type: SET_PROGRAM_VERSION_ID,
                        payload: `${record.programId}-${record.year}-${record.semester}`,
                      });
                    }}
                    key="1"
                  >
                    <NavLink
                      to={`/program-version/${record.programId}-${record.year}-${record.semester}/course-instances`}
                    >
                      View Courses
                    </NavLink>
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => {
                      dispatch({
                        type: SET_PROGRAM_VERSION_ID,
                        payload: `${record.programId}-${record.year}-${record.semester}`,
                      });
                    }}
                    key="2"
                  >
                    <NavLink
                      to={`/program-version/${record.programId}-${record.year}-${record.semester}/foundation-test`}
                    >
                      View Foundation Test
                    </NavLink>
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => {
                      dispatch({
                        type: SET_PROGRAM_VERSION_ID,
                        payload: `${record.programId}-${record.year}-${record.semester}`,
                      });
                    }}
                    key="3"
                  >
                    <NavLink
                      to={`/program-version/${record.programId}-${record.year}-${record.semester}/thesis`}
                    >
                      View Thesis
                    </NavLink>
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => {
                      dispatch({
                        type: SET_PROGRAM_VERSION_ID,
                        payload: `${record.programId}-${record.year}-${record.semester}`,
                      });
                    }}
                    key="4"
                  >
                    <NavLink
                      to={`/program-version/${record.programId}-${record.year}-${record.semester}/survey`}
                    >
                      View Survey
                    </NavLink>
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => {
                      dispatch({
                        type: SET_PROGRAM_VERSION_ID,
                        payload: `${record.programId}-${record.year}-${record.semester}`,
                      });
                    }}
                    key="5"
                  >
                    <NavLink
                      to={`/program-version/${record.programId}-${record.year}-${record.semester}/assessment-report`}
                    >
                      View Course Assessment Report
                    </NavLink>
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => {
                      dispatch({
                        type: SET_PROGRAM_VERSION_ID,
                        payload: `${record.programId}-${record.year}-${record.semester}`,
                      });
                    }}
                    key="6"
                  >
                    <NavLink
                      to={`/program-version/${record.programId}-${record.year}-${record.semester}/survey-report`}
                    >
                      View Survey Report
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

  const updateAscending = (hasAscending) => {
    setAscending(hasAscending)
    let newSearchArraysortBy = updateSearchObj('orderBy', hasAscending ? 'asc' : 'desc', searchedObj)
    setSearchedObj(newSearchArraysortBy)
  }

  const clearAllSearch = () => {
    dispatch(getProgramVersionActionApi(1, [])) 
    setSearchedObj([])
    setPage(1)
    setDefaultSort('programId')
    setAscending(true)
  }

  return (
    <div className="mt-2 program">
      <div className="d-flex justify-content-start align-items-center">
        <h5 className="mb-0 mr-5">
          <FormattedMessage id="PROGRAM_VESION" />
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
                title: "ADD NEW PROGRAM VERSION",
                Component: <FormProgramVersion />,
              };
              dispatch(action);
              const action2 = {
                type: SET_EDIT_PROGRAM_VERSION,
                payload: { isEdit: false }
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
        <Pagination current={page} total={programVersion.total} onChange={onChange} />
      </div>
    </div>
  );
}
