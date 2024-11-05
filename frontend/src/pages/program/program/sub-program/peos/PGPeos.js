import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Input, Button, Pagination } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { FormattedMessage } from "react-intl";
import { getPEOsByProgarmActionApi } from "../../../../../actions/api-actions/ProgramAction";
import "./PGPeos.scss";
import {
  ADD_INFO_COURSE_DRAWER,
  SET_EDIT_PEOS,
} from "../../../../../redux/types";
import FormPGPeos from "../../../../../components/form-pg-peos/FormPGPeos";
import DropdownSort2 from "../../../../../components/dropdown-sort/DropdownSort2";

export default function PGPeos() {
  const [isAscending, setAscending] = useState(true)
  const [defaultSort, setDefaultSort] = useState('name')
  const sortList = ['name', 'priority', 'description']
  const [searchedObj, setSearchedObj] = useState([])
  const [page, setPage] = useState(1);
  const { selectedFolw } = useSelector((state) => state.GeneralProgramReducer);
  const { peos } = useSelector((state) => state.GeneralProgramReducer);
  const { isUpdateSuccess } = useSelector((state) => state.GeneralProgramReducer);

  useEffect(async () => {
    if (!isUpdateSuccess) return;
    setPage(1);
    setDefaultSort('name');
    setAscending(true);
  }, [isUpdateSuccess]);

  const dispatch = useDispatch();

  const { programId } = selectedFolw

  useEffect(() => {
    if(programId) {
      dispatch(getPEOsByProgarmActionApi(1, programId, []));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [programId]);

  const onChange = (page) => {
    if(programId) {
      dispatch(getPEOsByProgarmActionApi(page, programId));
    }
    setPage(page);
  };

  const handleSearch = () => {
    if(programId) {
      dispatch(getPEOsByProgarmActionApi(1, programId, searchedObj))
    }
  }

  const handleReset = (dataIndex, clearFilters) => {
    clearFilters();
    let searchedObjUpdate = searchedObj.filter(item => item.key !== dataIndex)
    setSearchedObj(searchedObjUpdate)
    if(programId) {
      dispatch(getPEOsByProgarmActionApi(1, programId, searchedObjUpdate))
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
      dispatch(getPEOsByProgarmActionApi(1, programId, []))
    }
    setSearchedObj([])
    setPage(1)
    setDefaultSort('name')
    setAscending(true)
  }

  const data = peos?.data?.map((peo, idx) => {
    return {
      ...peo,
      key: (page - 1) * 10 + idx + 1,
    };
  });

  const columns = [
    {
      title: "STT",
      dataIndex: "key",
      key: "key",
      fixed: 'left',
      width: "60px",
      className: 'drag-visible',
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      fixed: 'left',
      width: "100px",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      width: "90px",
      ...getColumnSearchProps("priority"),
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
      key: "action",
      fixed: 'right',
      width: "80px",
      render: (text, record, index) => {
        return (
          <span className="d-flex justify-content-center align-items-center">
            <span
              className="btn-edit mr-3"
              onClick={() => {
                const action1 = {
                  type: ADD_INFO_COURSE_DRAWER,
                  title: "EDIT PEOS",
                  Component: <FormPGPeos />,
                };

                //dispatch lên reducer nội dung drawer
                dispatch(action1);
                //dispatch dữ liệu dòng hiện tai lên reducer
                const action2 = {
                  type: SET_EDIT_PEOS,
                  payload: record,
                };
                dispatch(action2);
              }}
            >
              <i className="fa fa-edit"></i>
            </span>
          </span>
        );
      },
    },
  ];

  return (
    <div className="mt-2 peos">
      <div className="d-flex justify-content-start align-items-center">
        <h5 className="mb-0 mr-5">
          <FormattedMessage id="PEOS" />
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
                title: "ADD NEW PEOS",
                Component: <FormPGPeos />,
              };
              dispatch(action);
              const action2 = {
                type: SET_EDIT_PEOS,
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
        <Pagination current={page} total={peos.total} onChange={onChange} />
      </div>
    </div>
  );
}
