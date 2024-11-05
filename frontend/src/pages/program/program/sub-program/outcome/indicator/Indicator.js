import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { Table, Input, Button, Pagination } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { FormattedMessage } from "react-intl";
import { getIndicatorsByOutcomeActionApi } from '../../../../../../actions/api-actions/ProgramAction';
import { ADD_INFO_COURSE_DRAWER, SET_EDIT_INDICATOR } from '../../../../../../redux/types';
import FormIndicator from '../../../../../../components/form-indicator/FormIndicator';
import DropdownSort2 from '../../../../../../components/dropdown-sort/DropdownSort2';

export default function PGCurriculum() {
  const [isAscending, setAscending] = useState(true)
  const [defaultSort, setDefaultSort] = useState('name')
  const sortList = ['name','description','cdio']
  const [searchedObj, setSearchedObj] = useState([])
  const [page, setPage] = useState(1);
  const { selectedFolw } = useSelector((state) => state.GeneralProgramReducer);
  const { indicators } = useSelector((state) => state.GeneralProgramReducer);
  const { programId, outcomeName } = selectedFolw
  const { isUpdateSuccess } = useSelector((state) => state.GeneralProgramReducer);
  
  useEffect(async () => {
    if (!isUpdateSuccess) return;
    setPage(1);
    setDefaultSort('name');
    setAscending(true);
  }, [isUpdateSuccess]);
  
  const dispatch = useDispatch();

  useEffect(() => {
    if (programId && outcomeName) {
      dispatch(getIndicatorsByOutcomeActionApi(1, programId, outcomeName, []));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [programId, outcomeName]);

  const onChange = (page) => {
    if (programId && outcomeName) {
      dispatch(getIndicatorsByOutcomeActionApi(page, programId, outcomeName, searchedObj));
    }
    setPage(page);
  };

  const handleSearch = () => {
    if(programId && outcomeName) {
      dispatch(getIndicatorsByOutcomeActionApi(page, programId, outcomeName, searchedObj))
    }
  }

  const handleReset = (dataIndex, clearFilters) => {
    clearFilters();
    let searchedObjUpdate = searchedObj.filter(item => item.key !== dataIndex)
    setSearchedObj(searchedObjUpdate)
    if(programId && outcomeName) {
      dispatch(getIndicatorsByOutcomeActionApi(page, programId, outcomeName, searchedObjUpdate))
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
    if(programId && outcomeName) {
      dispatch(getIndicatorsByOutcomeActionApi(page, programId, outcomeName, []))
    }
    setSearchedObj([])
    setPage(1)
    setDefaultSort('name')
    setAscending(true)
  }

  const data = indicators?.data?.map((outcome, idx) => {
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
      width: "60px",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "60px",
      ...getColumnSearchProps("name"),
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
      width: "80px",
      ...getColumnSearchProps("cdio"),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      width: "60px",
      render: (text, record, index) => {
        return (
          <span className="d-flex justify-content-center align-items-center">
            <span
              className="btn-edit mr-3"
              onClick={() => {
                const action1 = {
                  type: ADD_INFO_COURSE_DRAWER,
                  title: "EDIT INDICATOR",
                  Component: <FormIndicator />,
                  width: 600,
                };

                //dispatch lên reducer nội dung drawer
                dispatch(action1);
                //dispatch dữ liệu dòng hiện tai lên reducer
                const action2 = {
                  type: SET_EDIT_INDICATOR,
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
    <div className="mt-2 outcomes">
      <div className="d-flex justify-content-start align-items-center">
        <h5 className="mb-0 mr-5">
          <FormattedMessage id="INDICATORS" />
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
                title: "ADD NEW INDICATOR",
                Component: <FormIndicator />,
                width: 600,
              };
              dispatch(action);
              const action2 = {
                type: SET_EDIT_INDICATOR,
                payload: {},
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
          <span title="Refresh page" onClick={() => clearAllSearch() } justify-content-end align-items-center className="icon mr-3">
            <i className="fa fa-sync-alt"></i>
          </span>
          <span className="icon mr-3">
            <i className="fa fa-download"></i>
          </span>
        </div>
      </div>
      <Table pagination={false} columns={columns} dataSource={data} />

      <div className="d-flex justify-content-center my-3">
        <Pagination current={page} total={indicators.total} onChange={onChange} />
      </div>
    </div>

  )
}
