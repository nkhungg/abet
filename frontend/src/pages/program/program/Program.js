import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProgramByGenProgramActionApi } from "../../../actions/api-actions/ProgramAction";
import { Table, Input, Button, Pagination, Menu, Dropdown } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import actions from "../../../asset/images/actions.png";
import { FormattedMessage } from "react-intl";
import { NavLink } from "react-router-dom";

import "./Program.scss";
import {
  ADD_INFO_COURSE_DRAWER,
  SET_EDIT_PROGRAM,
  SET_PROGRAM_ID,
} from "../../../redux/types";
import FormProgram from "../../../components/form-program/FormProgram";
import DropdownSort2 from "../../../components/dropdown-sort/DropdownSort2";

export default function Program() {
  const [isAscending, setAscending] = useState(true)
  const [defaultSort, setDefaultSort] = useState('id')
  const sortList = ['id', 'start', 'end', 'apply', 'major', 'description']
  const [searchedObj, setSearchedObj] = useState([])
  const [page, setPage] = useState(1);
  const { selectedFolw } = useSelector((state) => state.GeneralProgramReducer);
  const { isUpdateSuccess } = useSelector((state) => state.GeneralProgramReducer);
  
  useEffect(async () => {
    if (!isUpdateSuccess) return;
    setPage(1);
    setDefaultSort('id');
    setAscending(true);
  }, [isUpdateSuccess]);

  const dispatch = useDispatch();
  const { generalProgramId } = selectedFolw;

  useEffect(() => {
    if(generalProgramId) {
      dispatch(getProgramByGenProgramActionApi(1, generalProgramId, []));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generalProgramId]);

  const { program } = useSelector((state) => state.GeneralProgramReducer);

  const onChange = (page) => {
    if(generalProgramId) {
    dispatch(getProgramByGenProgramActionApi(page, generalProgramId, searchedObj));
    }
    setPage(page);
  };

  const handleSearch = () => {
    if(generalProgramId) {
      dispatch(getProgramByGenProgramActionApi(page, generalProgramId, searchedObj))
    }
  }

  const handleReset = (dataIndex, clearFilters) => {
    clearFilters();
    let searchedObjUpdate = searchedObj.filter(item => item.key !== dataIndex)
    setSearchedObj(searchedObjUpdate)
    if(generalProgramId) {
      dispatch(getProgramByGenProgramActionApi(page, generalProgramId, searchedObjUpdate))
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
    if(generalProgramId) {
      dispatch(getProgramByGenProgramActionApi(1, generalProgramId, []))
    }
    setSearchedObj([])
    setPage(1)
    setDefaultSort('id')
    setAscending(true)
  }

  const data = program?.data?.map((program, idx) => {
    return {
      ...program,
      key: (page - 1) * 10 + idx + 1,
      major: selectedFolw.generalProgramMajor,
      description: selectedFolw.generalProgramDesc,
    };
  });

  const columns = [
    {
      title: "Stt",
      dataIndex: "key",
      fixed: 'left',
      key: "key",
      width: "55px",
    },
    {
      title: "Id",
      dataIndex: "id",
      fixed: 'left',
      key: "id",
      width: "100px",
      ...getColumnSearchProps("id"),
    },
    {
      title: "Start Year",
      dataIndex: "start",
      key: "start",
      width: "10%",
      ...getColumnSearchProps("start"),
    },
    {
      title: "End Year",
      dataIndex: "end",
      key: "end",
      width: "10%",
      ...getColumnSearchProps("end"),
    },
    {
      title: "Apply",
      dataIndex: "apply",
      key: "apply",
      width: "10%",
      ...getColumnSearchProps("apply"),
    },
    {
      title: "Major",
      dataIndex: "major",
      key: "major",
      ...getColumnSearchProps("major"),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ...getColumnSearchProps("description"),
    },
    {
      title: "Action",
      dataIndex: "action",
      fixed: 'right',
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
                  title: "EDIT PROGRAM",
                  Component: <FormProgram />,
                };

                //dispatch lên reducer nội dung drawer
                dispatch(action1);
                //dispatch dữ liệu dòng hiện tai lên reducer
                const action2 = {
                  type: SET_EDIT_PROGRAM,
                  payload: record,
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
                        type: SET_PROGRAM_ID,
                        payload: record.id,
                      });
                    }}
                    key="1"
                  >
                    <NavLink
                      to={{
                        pathname: `/general-program/${selectedFolw.generalProgramId}/program/${record.id}/peos`,
                        genProgramId: 1,
                      }}
                    >
                      View PEOs
                    </NavLink>
                  </Menu.Item>
                  <Menu.Item
                    onClick={() => {
                      dispatch({
                        type: SET_PROGRAM_ID,
                        payload: record.id,
                      });
                    }}
                    key="2"
                  >
                    <NavLink
                      to={{
                        pathname: `/general-program/${selectedFolw.generalProgramId}/program/${record.id}/program-outcome`,
                        genProgramId: 1,
                      }}
                    >
                      View Program outcomes
                    </NavLink>
                  </Menu.Item>
                  <Menu.Item 
                  onClick={() => {
                      dispatch({
                        type: SET_PROGRAM_ID,
                        payload: record.id,
                      });
                    }}
                  key="3">
                    <NavLink
                      to={{
                        pathname: `/general-program/${selectedFolw.generalProgramId}/program/${record.id}/curriculum`,
                        genProgramId: 1,
                      }}
                    >
                      View Curriculum
                    </NavLink>
                  </Menu.Item>
                  <Menu.Item
                  onClick={() => {
                      dispatch({
                        type: SET_PROGRAM_ID,
                        payload: record.id,
                      });
                    }}
                  key="4">
                    <NavLink
                      to={{
                        pathname: `/general-program/${selectedFolw.generalProgramId}/program/${record.id}/matrix-peo`,
                        genProgramId: 1,
                      }}
                    >
                      View Matrix Peo - Program Outcome
                    </NavLink>
                  </Menu.Item>
                  <Menu.Item
                   onClick={() => {
                      dispatch({
                        type: SET_PROGRAM_ID,
                        payload: record.id,
                      });
                    }}
                  key="5">
                    <NavLink
                      to={{
                        pathname: `/general-program/${selectedFolw.generalProgramId}/program/${record.id}/matrix-course`,
                        genProgramId: 1,
                      }}
                    >
                      View Matrix Course -  Program Outcome
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
    <div className="mt-2 program">
      <div className="d-flex justify-content-start align-items-center">
        <h5 className="mb-0 mr-5">
          <FormattedMessage id="PROGRAM_BY_GEN" />
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
                title: "ADD NEW PROGRAM",
                Component: <FormProgram />,
              };
              dispatch(action);
              const action2 = {
                type: SET_EDIT_PROGRAM,
                payload: {
                  idGeneralProgram: selectedFolw.generalProgramId,
                  major: selectedFolw.generalProgramMajor,
                  description: selectedFolw.generalProgramDesc,
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
          <span title="Refresh page" onClick={() => clearAllSearch() } className="icon mr-3">
            <i className="fa fa-sync-alt"></i>
          </span>
          <span className="icon mr-3">
            <i className="fa fa-download"></i>
          </span>
        </div>
      </div>
      <Table  scroll={{ x: 992 }} pagination={false} columns={columns} dataSource={data} />

      <div className="d-flex justify-content-center my-3">
        <Pagination current={page} total={program.total} onChange={onChange} />
      </div>
    </div>
  );
}
