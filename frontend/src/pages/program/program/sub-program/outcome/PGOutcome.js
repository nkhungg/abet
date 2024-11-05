import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Input, Button, Pagination, Menu, Dropdown } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import actions from "../../../../../asset/images/actions.png";
import { FormattedMessage } from "react-intl";
import { NavLink } from "react-router-dom";
import { getOutcomesByProgramActionApi } from "../../../../../actions/api-actions/ProgramAction";
import "./PGOutcome.scss";
import {
  ADD_INFO_COURSE_DRAWER,
  SET_EDIT_OUTCOME,
  SET_OUTCOME_NAME,
} from "../../../../../redux/types";
import FormPGOutcomes from "../../../../../components/form-pg-outcoms/FormPGOutcomes";
import DropdownSort2 from "../../../../../components/dropdown-sort/DropdownSort2";

export default function PGOutcome() {
  const [isAscending, setAscending] = useState(true)
  const [defaultSort, setDefaultSort] = useState('outcomeName')
  const sortList = ['outcomeName', 'description', 'cdio']
  const [searchedObj, setSearchedObj] = useState([])
  const [page, setPage] = useState(1);
  const { selectedFolw } = useSelector((state) => state.GeneralProgramReducer);
  const { outcomes } = useSelector((state) => state.GeneralProgramReducer);
  const { isUpdateSuccess } = useSelector((state) => state.GeneralProgramReducer);

  useEffect(async () => {
    if (!isUpdateSuccess) return;
    setPage(1);
    setDefaultSort('outcomeName');
    setAscending(true);
  }, [isUpdateSuccess]);

  const dispatch = useDispatch();

  const { programId } = selectedFolw

  useEffect(() => {
    if(programId) {
      dispatch(getOutcomesByProgramActionApi(1, programId, []))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [programId]);

  const onChange = (page) => {
    if(programId) {
      dispatch(getOutcomesByProgramActionApi(page, programId, searchedObj));
    }
    setPage(page);
  };

  const handleSearch = () => {
    if(programId) {
      dispatch(getOutcomesByProgramActionApi(1, programId, searchedObj))
    }
  }

  const handleReset = (dataIndex, clearFilters) => {
    clearFilters();
    let searchedObjUpdate = searchedObj.filter(item => item.key !== dataIndex)
    setSearchedObj(searchedObjUpdate)
    if(programId) {
      dispatch(getOutcomesByProgramActionApi(1, programId, searchedObjUpdate))
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
    if(programId) {
      dispatch(getOutcomesByProgramActionApi(1, programId, []))
    }
    setSearchedObj([])
    setPage(1)
    setDefaultSort('outcomeName')
    setAscending(true)
  }

  const data = outcomes?.data?.map((outcome, idx) => {
    return {
      ...outcome,
      key: (page - 1) * 10 + idx + 1,
    };
  });

  const columns = [
    {
      title: "STT",
      dataIndex: "key",
      key: "key",
      width: "3%",
    },
    {
      title: "Name",
      dataIndex: "outcomeName",
      key: "outcomeName",
      width: "60px",
      ...getColumnSearchProps("outcomeName"),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      ...getColumnSearchProps("description"),
    },
    {
      title: "Cdio",
      dataIndex: "cdio",
      key: "cdio",
      width: "12%",
      ...getColumnSearchProps("cdio"),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: "60px",
      render: (text, record, index) => {
        return (
          <span className="d-flex justify-content-between align-items-center">
            <span
              className="btn-edit mr-3"
              onClick={() => {
                const action1 = {
                  type: ADD_INFO_COURSE_DRAWER,
                  title: "EDIT PROGRAM OUTCOMES",
                  Component: <FormPGOutcomes />,
                };

                //dispatch lên reducer nội dung drawer
                dispatch(action1);
                //dispatch dữ liệu dòng hiện tai lên reducer
                const action2 = {
                  type: SET_EDIT_OUTCOME,
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
                      type: SET_OUTCOME_NAME,
                      payload: record.outcomeName
                    })
                  }}
                  key="1">
                    <NavLink to={`/general-program/${selectedFolw.generalProgramId}/program/${selectedFolw.programId}/program-outcome/${record.outcomeName}/indicator`}>View Indicators</NavLink>
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
          <FormattedMessage id="PROGRAM_OUTCOMES" />
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
                title: "ADD NEW PROGRAM OUTCOME",
                Component: <FormPGOutcomes />,
              };
              dispatch(action);
              const action2 = {
                type: SET_EDIT_OUTCOME,
                payload: {
                  programId: selectedFolw.programId
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
          <span title="Refresh page" onClick={() => clearAllSearch()} className="icon mr-3">
            <i className="fa fa-sync-alt"></i>
          </span>
          <span className="icon mr-3">
            <i className="fa fa-download"></i>
          </span>
        </div>
      </div>
      <Table pagination={false} columns={columns} dataSource={data} />

      <div className="d-flex justify-content-center my-3">
        <Pagination current={page} total={outcomes.total} onChange={onChange} />
      </div>
    </div>
  );
}
